import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { AuthProvider } from './contexts/start/AuthContext';
import { BrowserRouter } from 'react-router-dom';
import { Routers } from './routers';
import { Provider } from 'react-redux';
import store from './stores/redux/store';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
  <AuthProvider>
    <BrowserRouter>
      <React.StrictMode>
        {/* <App /> */}
        <Routers />
      </React.StrictMode>
    </BrowserRouter>
  </AuthProvider>
  </Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
