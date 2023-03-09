import React from "react";
import { Route, Routes } from "react-router";
import { BrowserRouter } from "react-router-dom";
import LoginPage from "./pages/LoginPage";

// let hostUrl = "http://localhost:5000";
// if (process.env.NODE_ENV === "production") {
//   hostUrl = "https://trello-clone-server-snowy.vercel.app";
// }

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
