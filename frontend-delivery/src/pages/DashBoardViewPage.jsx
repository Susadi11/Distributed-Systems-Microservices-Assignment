import React from "react";
import { DashboardView } from "../components/dashboard-view.jsx"

export default function Home() {
  // In a real app, you would check authentication here
  // If not authenticated, redirect to login
  // const isAuthenticated = checkAuth()
  // if (!isAuthenticated) redirect('/login')

  return <DashboardView />
}
