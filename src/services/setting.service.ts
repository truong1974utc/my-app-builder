import axiosClient from "@/services/axiosClient";
import { PaginationMeta } from "@/types/pagination.type";
import { SettingItem } from "@/types/setting.type";

export interface GetSystemSettingsParams {
  page: number;
  limit: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "ASC" | "DESC";
}

export interface GetSystemSettingsResponse {
  items: SettingItem[];
  meta: PaginationMeta;
}

export const systemSettingService = {
  async getSystemSettings(params: GetSystemSettingsParams): Promise<GetSystemSettingsResponse> {
    const response = await axiosClient.get<{
      success: boolean;
      data: GetSystemSettingsResponse;
    }>("/settings", { params });
    if (!response.success) {
      throw new Error("Failed to fetch system settings");
    }
    return response.data;
  },

  async createSystemSetting(payload: {
    configKey: string;
    description: string;
    configData: Record<string, any>;
  }) {
    const response = await axiosClient.post<{
      success: boolean;
      data: SettingItem;
    }>("/settings", payload);
    if (!response.success) {
      throw new Error("Failed to create system setting");
    }
    return response.data;
  },

  async updateSystemSetting(id: string, payload: {
    configKey: string;
    description: string;
    configData: Record<string, any>;
  }) {
    const response = await axiosClient.put<{ success: boolean; data: SettingItem }>(`/settings/${id}`, payload);
    if (!response.success) {
      throw new Error("Failed to update system setting");
    }
    return response.data;
  },

  async deleteSystemSetting(id: string) {
    const response = await axiosClient.delete<{ success: boolean; data: SettingItem; message: string }>(`/settings/${id}`);
    if (!response.success) {
      throw new Error("Failed to delete system setting");
    }
    return response.data;
  },
}
