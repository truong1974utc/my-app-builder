import axiosClient from "@/services/axiosClient";
import { User } from "@/types/user.type";
import { PaginationMeta } from "@/types/pagination.type";

export interface GetUsersParams {
  page: number;
  limit: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "ASC" | "DESC";
  role?: string;
  status?: string;
}

export interface GetUsersResponse {
  items: User[];
  meta: PaginationMeta;
}

export const usersService = {
  async getUsers(params: GetUsersParams): Promise<GetUsersResponse> {
    const response = await axiosClient.get<{
      success: boolean;
      data: GetUsersResponse;
    }>("/users", {
      params,
      headers: {
        "Cache-Control": "no-cache",
        Pragma: "no-cache",
      },
    });
    if (!response.success) {
      throw new Error("Failed to fetch users");
    }
    return response.data;
  },

  async createUser(payload: {
    fullName: string;
    email: string;
    password: string;
    role: string;
    status: string;
  }) {
    const response = await axiosClient.post("/users", payload);
    return response.data;
  },

  async updateUser(
    id: string,
    payload: Partial<{
      fullName: string;
      email: string;
      password: string;
      role: string;
      status: string;
    }>,
  ) {
    const response = await axiosClient.put(`/users/${id}`, payload);
    return response.data;
  },

  async deleteUser(id: string) {
    const response = await axiosClient.delete(`/users/${id}`);
    return response.data;
  },
}
