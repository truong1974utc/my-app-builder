import axiosClient from "@/services/axiosClient";
import { PaginationMeta } from "@/types/pagination.type";

export interface SystemSettingItem {
  id: string;
  createdAt: string;
  updatedAt: string;
  configKey: string;
  description: string;
  configData: Record<string, any>;
}

export interface GetSystemSettingsParams {
  page: number;
  limit: number;
  search?: string;
}

export interface GetSystemSettingsResponse {
  items: SystemSettingItem[];
  meta: PaginationMeta;
}

export const systemSettingService = {
  getSystemSettings(params: GetSystemSettingsParams) {
    return axiosClient.get<{
      success: boolean;
      data: GetSystemSettingsResponse;
    }>("/settings", {
      params,
      headers: {
        "Cache-Control": "no-cache",
        Pragma: "no-cache",
      },
    });
  },

  getSystemSetting(id: string) {
    return axiosClient.get<{
      success: boolean;
      data: SystemSettingItem;
    }>(`/settings/${id}`);
  },

  createSystemSetting(payload: {
    configKey: string;
    description: string;
    configData: Record<string, any>;
  }) {
    return axiosClient.post<{
      success: boolean;
      data: SystemSettingItem;
    }>("/settings", payload);
  },

  updateSystemSetting(
    id: string,
    payload: {
      configKey: string;
      description: string;
      configData: Record<string, any>;
    }
  ) {
    return axiosClient.put<{
      success: boolean;
      data: SystemSettingItem;
    }>(`/settings/${id}`, payload);
  },

  deleteSystemSetting(id: string) {
    return axiosClient.delete<{
      success: boolean;
    }>(`/settings/${id}`);
  },
};