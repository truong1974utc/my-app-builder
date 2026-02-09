import axiosClient from "@/services/axiosClient"
import { User } from "@/types/user.type"
import { PaginationMeta } from "@/types/pagination.type"

export interface GetUsersParams {
  page: number
  limit: number
  search?: string
  sortBy?: string
  sortOrder?: "asc" | "desc"
  role?: string
  status?: string
}

export interface GetUsersResponse {
  items: User[]
  meta: PaginationMeta
}

export const usersService = {
  getUsers(params: GetUsersParams) {
    return axiosClient.get<{
      success: boolean
      data: GetUsersResponse
    }>("/users", {
      params,
      headers: {
        "Cache-Control": "no-cache",
        Pragma: "no-cache",
      },
    })
  },

  createUser(payload: {
    fullName: string
    email: string
    password: string
    role: string
    status: string
  }) {
    return axiosClient.post("/users", payload)
  }
}

