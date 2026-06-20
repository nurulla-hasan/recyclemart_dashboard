/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";
import { buildQueryString } from "@/lib/buildQueryString";
import { serverFetch } from "@/lib/fetcher";

// GET ALL VENDORS
export const getAllVendors = async (query: Record<string, string | string[] | undefined> = {}) => {
  try {
    return await serverFetch(`/vendor/admin${buildQueryString(query)}`, {
      tags: ["VENDOR-LIST"],
    });
  } catch {
    return { success: false, data: [], meta: { total: 0, page: 1, limit: 10, totalPages: 0 } };
  }
};

// APPROVE VENDOR
export const approveVendor = async (vendorId: string) => {
  try {
    const result = await serverFetch(`/vendor/${vendorId}/approve`, {
      method: "PATCH",
      body: {},
      updateTag: "VENDOR-LIST",
    });

    return result;
 } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to approve vendor";
    return { success: false, message };
  }
};

// REJECT VENDOR
export const rejectVendor = async (vendorId: string, reason: string): Promise<any> => {
  try {
    const result = await serverFetch(`/vendor/${vendorId}/reject`, {
        method: "PATCH",
        body: { reason },
        updateTag: "VENDOR-LIST",
      }
    );

    return result;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to reject vendor";
    return { success: false, message };
  }
};

// BLOCK VENDOR
export const blockVendor = async (vendorId: string, reason: string): Promise<any> => {
  try {
    const result = await serverFetch(`/vendor/${vendorId}/block`, {
      method: "PATCH",
      body: { reason },
      updateTag: "VENDOR-LIST",
    });

    return result;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to block vendor";
    return { success: false, message };
  }
};

// UNBLOCK VENDOR
export const unblockVendor = async (vendorId: string, reason: string): Promise<any> => {
  try {
    const result = await serverFetch(`/vendor/${vendorId}/unblock`, {
      method: "PATCH",
      body: { reason },
      updateTag: "VENDOR-LIST",
    });

    return result;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to unblock vendor";
    return { success: false, message };
  }
};

// DELETE VENDOR
export const deleteVendor = async (vendorId: string): Promise<any> => {
  try {
    const result = await serverFetch(`/vendor/${vendorId}`, {
      method: "DELETE",
      updateTag: ["VENDOR-LIST", "USER-LIST", "AD-LIST"],
    });

    return result;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to delete vendor";
    return { success: false, message };
  }
};

