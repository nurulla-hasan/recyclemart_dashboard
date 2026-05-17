/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { serverFetch } from "@/lib/fetcher";

export const getExtraData = async () => {
  try {
    const res = await serverFetch("/extra-data", {
      next: { tags: ["extra-data"] },
    });
    return res;
  } catch (error: any) {
    return { success: false, message: error?.message || "Failed to fetch extra data" };
  }
};

export const upsertExtraData = async (formData: FormData) => {
  try {
    const res = await serverFetch("/extra-data", {
      method: "POST",
      body: formData,
      updateTag: "extra-data",
    });
    return res;
  } catch (error: any) {
    return { success: false, message: error?.message || "Failed to update extra data" };
  }
};

export const updateWebsiteLogo = async (formData: FormData) => {
  try {
    const res = await serverFetch("/extra-data/logo", {
      method: "POST",
      body: formData,
      updateTag: "extra-data",
    });
    return res;
  } catch (error: any) {
    return { success: false, message: error?.message || "Failed to update website logo" };
  }
};

export const updateExtraLink = async (linkKey: string, link: string) => {
  try {
    const res = await serverFetch("/extra-data/link", {
      method: "POST",
      body: { linkKey, link },
      updateTag: "extra-data",
    });
    return res;
  } catch (error: any) {
    return { success: false, message: error?.message || "Failed to update link" };
  }
};

export const updateExtraHeading = async (heading: string[]) => {
  try {
    const res = await serverFetch("/extra-data/heading", {
      method: "POST",
      body: { heading },
      updateTag: "extra-data",
    });
    return res;
  } catch (error: any) {
    return { success: false, message: error?.message || "Failed to update heading" };
  }
};
