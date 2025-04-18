import axiosClient from "../api/axiosClient";

export const profileService = {
    // Fetch profile
    async fetchProfile() {
      const response = await axiosClient.get("/profile");
      return response.data;
    },

    // Update profile information
    async updateProfile(profileData) {
      const response = await axiosClient.put("/profile", profileData);
      return response.data;
    },

    // Update notification settings
    async updateNotifications(notificationData) {
      const response = await axiosClient.put("/profile", {
        notifications: notificationData
      });
      return response.data;
    },

    // Update security settings
    async updateSecurity(securityData) {
      const response = await axiosClient.put("/profile", {
        security: securityData
      });
      return response.data;
    }
  };