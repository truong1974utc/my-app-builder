export type UserRole = "SUPER_ADMIN" | "ADMIN"

export type UserStatus = "ACTIVE" | "INACTIVE"

export interface User {
  id: string
  fullName: string
  email: string
  role: UserRole
  status: UserStatus
  avatarUrl?: string | null
  createdAt: string
}
