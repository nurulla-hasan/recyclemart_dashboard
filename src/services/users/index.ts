"use server";

import { buildQueryString } from "@/lib/buildQueryString";
import { serverFetch } from "@/lib/fetcher";

export const getAllUsers = async (query: Record<string, string | string[] | undefined> = {}) => {
  try {
    return await serverFetch(`/user/admin-get-all${buildQueryString(query)}`, {
      tags: ["USER-LIST"],
    });
  } catch {
    return { success: false, data: [], meta: { total: 0, page: 1, limit: 10, totalPages: 0 } };
  }
};

export const toggleUserBlock = async (id: string) => {
  try {
    const res = await serverFetch(`/admin/users/${id}/toggle-block`, {
      method: "PATCH",
      updateTag: "USER-LIST",
    });
    return res;
  } catch {
    return { success: false, message: "Something went wrong" };
  }
};

export const deleteUser = async (id: string) => {
  try {
    const res = await serverFetch(`/admin/users/${id}`, {
      method: "DELETE",
      updateTag: ["USER-LIST", "VENDOR-LIST", "AD-LIST"],
    });
    return res;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to delete user";
    return { success: false, message };
  }
};
