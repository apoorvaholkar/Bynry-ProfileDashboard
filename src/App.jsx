import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import "./App.css";
import ProfileDirectory from "./components/ProfileDirectory";
import AdminPanel from "./components/AdminPanel";

function App() {


  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <div className="container mx-auto py-8">
              <AdminPanel />
            </div>
          }
        />
         <Route
          path="/profiles"
          element={
            <div className="container mx-auto py-8">
              <ProfileDirectory />
            </div>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;