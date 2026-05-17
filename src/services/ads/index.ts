/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { buildQueryString } from "@/lib/buildQueryString";
import { serverFetch } from "@/lib/fetcher";

export const getAllAds = async (query: Record<string, string | string[] | undefined> = {}) => {
  try {
    return await serverFetch(`/ad/admin${buildQueryString(query)}`, {
      tags: ["AD-LIST"],
    });
  } catch {
    return { success: false, data: [], meta: { total: 0, page: 1, limit: 10, totalPages: 0 } };
  }
};

export const approveAd = async (adId: string) => {
  try {
    const res = await serverFetch(`/ad/${adId}/approve`, {
      method: "PATCH",
      updateTag: "AD-LIST",
    });
    return res;
  } catch (error: any) {
    return { success: false, message: error?.message || "Failed to approve ad" };
  }
};

export const rejectAd = async (adId: string, data: { reason: string; note?: string }) => {
  try {
    const res = await serverFetch(`/ad/${adId}/reject`, {
      method: "PATCH",
      body: data,
      updateTag: "AD-LIST",
    });
    return res;
  } catch (error: any) {
    return { success: false, message: error?.message || "Failed to reject ad" };
  }
};

export const deleteAd = async (adId: string) => {
  try {
    const res = await serverFetch(`/ad/${adId}`, {
      method: "DELETE",
      updateTag: "AD-LIST",
    });
    return res;
  } catch (error: any) {
    return { success: false, message: error?.message || "Failed to delete ad" };
  }
};
