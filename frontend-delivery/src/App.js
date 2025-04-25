import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./Home";
import { DashboardView } from "./components/dashboard-view";

export default function App() {
  return (
      <Routes>
        <Route path="/" element={<DashboardView />} />
      </Routes>
  );
}