/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { buildQueryString } from "@/lib/buildQueryString";
import { serverFetch } from "@/lib/fetcher";

// GET ALL CATEGORIES
export const getAllCategories = async (query: Record<string, string | string[] | undefined> = {}) => {
  try {
    return await serverFetch(`/category${buildQueryString(query)}`, {
      tags: ["CATEGORY-LIST"],
    });
  } catch {
    return { success: false, data: [], meta: { total: 0, page: 1, limit: 10, totalPages: 0 } };
  }
};

// CREATE CATEGORY
export const createCategory = async (formData: FormData) => {
  try {
    const res = await serverFetch("/category", {
      method: "POST",
      body: formData, // serverFetch should handle FormData
      updateTag: "CATEGORY-LIST",
    });
    return res;
  } catch (error: any) {
    return { success: false, message: error?.message || "Failed to create category" };
  }
};

// UPDATE CATEGORY
export const updateCategory = async (categoryId: string, formData: FormData) => {
  try {
    const res = await serverFetch(`/category/${categoryId}`, {
      method: "PUT",
      body: formData,
      updateTag: "CATEGORY-LIST",
    });
    return res;
  } catch (error: any) {
    return { success: false, message: error?.message || "Failed to update category" };
  }
};

// DELETE CATEGORY
export const deleteCategory = async (categoryId: string) => {
  try {
    const res = await serverFetch(`/category/${categoryId}`, {
      method: "DELETE",
      updateTag: "CATEGORY-LIST",
    });
    return res;
  } catch (error: any) {
    return { success: false, message: error?.message || "Failed to delete category" };
  }
};
