/* eslint-disable @typescript-eslint/no-explicit-any */
 
"use server";

import { buildQueryString } from "@/lib/buildQueryString";
import { serverFetch } from "@/lib/fetcher";

// GET ALL ADMINS
export const getAllAdmins = async (query: Record<string, string | string[] | undefined> = {}) => {
  try {
    return await serverFetch(`/admin${buildQueryString(query)}`, {
      tags: ["ADMIN-LIST"],
    });
  } catch {
    return { success: false, data: [], meta: { total: 0, page: 1, limit: 10, totalPage: 0 } };
  }
};

// CREATE ADMIN
export const createAdmin = async (data: any) => {
  try {
    const res = await serverFetch("/admin", {
      method: "POST",
      body: data,
      updateTag: "ADMIN-LIST",
    });
    return res;
  } catch (error: any) {
    return { success: false, message: error?.message || "Failed to create admin" };
  }
};

// UPDATE ADMIN
export const updateAdmin = async (id: string, data: any) => {
  try {
    const res = await serverFetch(`/admin/${id}`, {
      method: "PATCH",
      body: data,
      updateTag: "ADMIN-LIST",
    });
    return res;
  } catch (error: any) {
    return { success: false, message: error?.message || "Failed to update admin" };
  }
};

// DELETE ADMIN
export const deleteAdmin = async (id: string) => {
  try {
    const res = await serverFetch(`/admin/${id}`, {
      method: "DELETE",
      updateTag: "ADMIN-LIST",
    });
    return res;
  } catch (error: any) {
    return { success: false, message: error?.message || "Failed to delete admin" };
  }
};
