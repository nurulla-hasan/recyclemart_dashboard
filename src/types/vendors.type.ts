/* eslint-disable @typescript-eslint/no-explicit-any */
export interface VendorUser {
  _id: string;
  name: string;
  phone: string;
  email: string;
  role: string;
}

export interface Vendor {
  _id: string;
  user: VendorUser;
  storeName: string;
  storeImage?: string;
  storeLocation: string;
  tradeLicense?: string;
  tradeLicenseNumber?: string;
  status: string; // e.g., PENDING, APPROVED
  approvalNote?: string | null;
  approvedAt?: string | null;
  approvedBy?: any; // Define properly if needed
  blocked: boolean;
  blockedAt?: string | null;
  blockedBy?: any;
  blockReason?: string | null;
  currentPlanId?: string | null;
  planExpiresAt?: string | null;
  listingsUsed: number;
  createdAt: string;
  updatedAt: string;
}
