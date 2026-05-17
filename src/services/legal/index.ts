/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { serverFetch } from "@/lib/fetcher";

export const getPageByType = async (type: string) => {
  try {
    return await serverFetch(`/page/retrieve/${type}`, {
      tags: [`PAGE-${type}`],
    });
  } catch {
    return { success: false, data: null };
  }
};

export const createOrUpdatePage = async (data: {
  title: string;
  type: string;
  content: string;
}) => {
  try {
    const res = await serverFetch("/page/create-or-update", {
      method: "PUT",
      body: data,
      updateTag: `PAGE-${data.type}`,
    });
    return res;
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || "Failed to update page content",
    };
  }
};
