/* eslint-disable @typescript-eslint/no-explicit-any */
 
"use server";

import { buildQueryString } from "@/lib/buildQueryString";
import { serverFetch } from "@/lib/fetcher";

// GET ALL CONTACTS/TICKETS
export const getAllContacts = async (query: Record<string, string | string[] | undefined> = {}) => {
  try {
    return await serverFetch(`/contact${buildQueryString(query)}`, {
      tags: ["CONTACT-LIST"],
    });
  } catch {
    return { success: false, data: [], meta: { total: 0, page: 1, limit: 10, totalPage: 0 } };
  }
};

// SEND EMAIL TO USER
export const sendReplyEmail = async (data: { email: string; subject: string; message: string }) => {
  try {
    const res = await serverFetch("/contact/send-email", {
      method: "POST",
      body: data,
      updateTag: "CONTACT-LIST",
    });
    return res;
  } catch (error: any) {
    return { success: false, message: error?.message || "Failed to send email" };
  }
};
