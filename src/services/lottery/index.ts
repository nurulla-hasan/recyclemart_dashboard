/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { buildQueryString } from "@/lib/buildQueryString";
import { serverFetch } from "@/lib/fetcher";
import { QueryParams } from "@/types/global.types";

export const getAllLotteries = async (query: QueryParams = {}) => {
  
  try {
    return await serverFetch(`/lottery/admin${buildQueryString(query)}`, {
      tags: ["LOTTERY-LIST"],
    });
  } catch {
    return { success: false, data: [], meta: {} };
  }
};

export const createLottery = async (formData: FormData) => {
  try {
    // Postman অনুযায়ী lotteryImage এবং data (JSON string) আলাদাভাবে পাঠাতে হবে
    const res = await serverFetch("/lottery", {
      method: "POST",
      body: formData,
      updateTag: "LOTTERY-LIST",
    });
    return res;
  } catch (error: any) {
    return { success: false, message: error?.message || "Failed to create lottery" };
  }
};

export const updateLottery = async (id: string, formData: FormData) => {
  try {
    const res = await serverFetch(`/lottery/${id}`, {
      method: "PATCH",
      body: formData,
      updateTag: "LOTTERY-LIST",
    });
    return res;
  } catch (error: any) {
    return { success: false, message: error?.message || "Failed to update lottery" };
  }
};

export const runLotteryDraw = async (id: string, winningToken?: string) => {
  try {
    const query = winningToken ? `?winningToken=${winningToken}` : "";
    const res = await serverFetch(`/lottery/${id}/draw${query}`, {
      method: "POST",
      updateTag: "LOTTERY-LIST",
    });
    return res;
  } catch (error: any) {
    return { success: false, message: error?.message || "Failed to run draw" };
  }
};
