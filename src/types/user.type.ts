import { ERole } from "@/enums/role.enum"
import { EStatusUser } from "@/enums/status.enum"

export interface TUser {
  id: string
  fullName: string
  email: string
  role: ERole
  status: EStatusUser
  avatarUrl?: string | null
  createdAt: string
}
