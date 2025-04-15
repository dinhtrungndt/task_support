import React, { createContext, useState, useEffect } from "react";
import { getIdUser, refreshToken, logout } from "../../services/user";
import { secureStorage } from "../../utils/secureDataUtils";
import {
  resetActivityTimestamp,
  clearActivityData,
} from "../../utils/sessionUtils";
import { setCurrentUser } from "../../stores/redux/actions/userActions";
import { useDispatch } from "react-redux";
import io from "socket.io-client";

export const AuthContext = createContext();

const safelyDecodeToken = (token) => {
  try {
    if (!token) return null;

    const base64Url = token.split(".")[1];
    if (!base64Url) return null;

    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const paddedBase64 = base64.padEnd(
      base64.length + ((4 - (base64.length % 4)) % 4),
      "="
    );

    const jsonPayload = decodeURIComponent(
      atob(paddedBase64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );

    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("Token decode error");
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const dispatch = useDispatch();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tokenExpiryTime, setTokenExpiryTime] = useState(null);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (user) {
      const token = secureStorage.getItem("tz");
      if (!token) {
        console.error("No token found. Please log in.");
        return;
      }

      const newSocket = io(process.env.REACT_APP_API_URL, {
        transports: ["websocket", "polling"],
        auth: {
          token: token,
        },
      });

      setSocket(newSocket);

      return () => {
        newSocket.disconnect();
        setSocket(null);
      };
    }
  }, [user]);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = secureStorage.getItem("tz");
        const storedUser = secureStorage.getItem("ts");

        if (token && storedUser) {
          try {
            const decodedToken = safelyDecodeToken(token);

            if (decodedToken && decodedToken.exp) {
              const expiryTime = new Date(decodedToken.exp * 1000);
              setTokenExpiryTime(expiryTime);

              const timeUntilExpiry =
                expiryTime.getTime() - new Date().getTime();
              if (timeUntilExpiry < 300000) {
                try {
                  const newToken = await refreshToken();
                  if (newToken) {
                    const newDecodedToken = safelyDecodeToken(newToken);
                    if (newDecodedToken && newDecodedToken.exp) {
                      setTokenExpiryTime(new Date(newDecodedToken.exp * 1000));
                    }
                  }
                } catch (refreshError) {
                  console.warn("Token refresh failed during initialization");
                }
              }
            }

            setUser(storedUser);
            dispatch(setCurrentUser(storedUser));

            resetActivityTimestamp();
          } catch (tokenError) {
            console.error("Token validation error");
            setUser(storedUser);
            dispatch(setCurrentUser(storedUser));

            resetActivityTimestamp();
          }
        }
      } catch (error) {
        console.error("Auth initialization error");
        handleLogout();
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  useEffect(() => {
    if (user) {
      const token = secureStorage.getItem("tz");

      const newSocket = io(process.env.REACT_APP_API_URL, {
        transports: ["websocket", "polling"],
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        auth: {
          token: token,
        },
      });

      newSocket.on("connect", () => {
        // console.log("Socket.IO connected successfully");
      });

      newSocket.on("connect_error", (error) => {
        if (error.message === "Authentication error: Token required") {
          // console.error("Authentication failed. Please log in again.");
          handleLogout();
        } else {
          console.error("Socket.IO connection error:", error);
        }
      });

      newSocket.on("disconnect", (reason) => {
        // console.log("Socket.IO disconnected:", reason);
      });

      setSocket(newSocket);

      return () => {
        newSocket.disconnect();
        setSocket(null);
      };
    }
  }, [user]);

  const handleLogout = () => {
    clearActivityData();
    logout();
    setUser(null);
    setTokenExpiryTime(null);

    if (socket) {
      socket.disconnect()
      setSocket(null);
    }
  };

  const loginUser = (userData) => {
    setUser(userData);
    dispatch(setCurrentUser(userData));

    const token = secureStorage.getItem("tz");
    if (token) {
      const decodedToken = safelyDecodeToken(token);
      if (decodedToken && decodedToken.exp) {
        setTokenExpiryTime(new Date(decodedToken.exp * 1000));
      }
    }

    resetActivityTimestamp();
  };

  const contextValue = {
    user,
    loading,
    loginUser,
    logoutUser: handleLogout,
    socket,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;