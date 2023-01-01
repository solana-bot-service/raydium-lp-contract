import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import 'mapbox-gl/dist/mapbox-gl.css';

import { LiffProvider } from 'react-liff';

import "./index.css";
import App from "./App";
import { AuthProvider } from "./auth/AuthContext";

const liffId = '1657781805-oNWg52EQ' //process.env.REACT_APP_LINE_LIFF_ID;

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      
    <LiffProvider liffId={liffId}>
      <AuthProvider>
          <App />
        </AuthProvider>
    </LiffProvider>

    </BrowserRouter>
  </React.StrictMode>
);