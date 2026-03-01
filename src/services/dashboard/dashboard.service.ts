import axiosClient from "@/services/axiosClient";
import { get } from "http";
import { Category } from "./../../types/category.type";

export interface DashboardStats {
  totalUsers: number;
  publishedPages: number;
  totalDocuments: number;
}

export interface GrowthDataset {
  name: string;
  data: number[];
}

export interface DashboardGrowth {
  labels: string[];
  datasets: GrowthDataset[];
}

export interface CategorySplitItem {
  name: string;
  value: number;
  percentage: number;
}

export interface LastestProduct {
  id: string;
  name: string;
  sku: string;
  basePrice: string;
  mainImage: string;
  createAt: string;
}

export interface ContentStatusItem {
  id: string;
  title: string;
  status: "PUBLISHED" | "DRAFT";
  action: string;
  createAt: string;
  updatedAt: string;
}

export const dashboardService = {
  async getStats(): Promise<DashboardStats> {
    const response = await axiosClient.get<{
      success: boolean;
      data: DashboardStats;
    }>("/dashboard/stats");

    if (!response.success) {
      throw new Error("Failed to fetch dashboard stats");
    }

    return response.data;
  },

  async getGrowth(): Promise<DashboardGrowth> {
    const response = await axiosClient.get<{
      success: boolean;
      data: DashboardGrowth;
    }>("/dashboard/growth");

    if (!response.success) {
      throw new Error("Failed to fetch dashboard growth data");
    }
    return response.data;
  },

  async getCategorySplit(): Promise<CategorySplitItem[]> {
    const response = await axiosClient.get<{
      success: boolean;
      data: CategorySplitItem[];
    }>("/dashboard/category-split");

    if (!response.success) {
      throw new Error("Failed to fetch category split data");
    }
    return response.data;
  },

  async getLatestProducts(): Promise<LastestProduct[]> {
    const response = await axiosClient.get<{
      success: boolean;
      data: LastestProduct[];
    }>("/dashboard/latest-products");

    if (!response.success) {
      throw new Error("Failed to fetch latest products");
    }
    return response.data;
  },

  async getContentStatus(): Promise<ContentStatusItem[]> {
    const response = await axiosClient.get<{
      success: boolean;
      data: ContentStatusItem[];
    }>("/dashboard/content-status");
    
    if (!response.success) {
      throw new Error("Failed to fetch content status");
    }
    return response.data;
  },
};
