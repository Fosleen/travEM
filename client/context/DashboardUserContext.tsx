"use client";
import { createContext, useContext } from "react";

export type DashboardUser = { id: number; username: string; is_admin: number };
export const DashboardUserContext = createContext<DashboardUser | null>(null);
export const useDashboardUser = () => {
  const user = useContext(DashboardUserContext);
  return { user, isAdmin: Number(user?.is_admin) === 1 };
};
