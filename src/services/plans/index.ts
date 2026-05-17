/* eslint-disable @typescript-eslint/no-explicit-any */
 
"use server";

import { buildQueryString } from "@/lib/buildQueryString";
import { serverFetch } from "@/lib/fetcher";

export const getAllSubscribers = async (query: Record<string, string | string[] | undefined> = {}) => {
  try {
    return await serverFetch(`/subscription/admin${buildQueryString(query)}`, {
      tags: ["PLAN-LIST"],
    });
  } catch {
    return { success: false, data: [], meta: { total: 0, page: 1, limit: 10, totalPages: 0 } };
  }
};


export const getAllPlans = async (query: Record<string, string | string[] | undefined> = {}) => {
  try {
    return await serverFetch(`/subscription/plans${buildQueryString(query)}`, {
      tags: ["PLAN-LIST"],
    });
  } catch {
    return { success: false, data: [], meta: { total: 0, page: 1, limit: 10, totalPages: 0 } };
  }
};

export const createPlan = async (data: any) => {
  try {
    const res = await serverFetch("/subscription/plans", {
      method: "POST",
      body: data,
      updateTag: "PLAN-LIST",
    });
    return res;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to create plan";
    return { success: false, message };
  }
};

export const updatePlan = async (planId: string, data: any) => {
  try {
    const res = await serverFetch(`/subscription/plans/${planId}`, {
      method: "PATCH",
      body: data,
      updateTag: "PLAN-LIST",
    });
    return res;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to update plan";
    return { success: false, message };
  }
};

export const deletePlan = async (planId: string) => {
  try {
    const res = await serverFetch(`/subscription/plans/${planId}`, {
      method: "DELETE",
      updateTag: "PLAN-LIST",
    });
    return res;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to delete plan";
    return { success: false, message };
  }
};

