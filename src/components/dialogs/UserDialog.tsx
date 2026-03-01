import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { User, Mail, Key, Eye, EyeOff, RefreshCw } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import { createUserSchema, CreateUserFormValues } from "@/schemas/user.schema";

interface UserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "create" | "edit";
  user?: {
    id: string;
    fullName: string;
    email: string;
    role: "ADMIN" | "SUPER_ADMIN";
    status: "ACTIVE" | "INACTIVE";
  };
  onSubmit: (data: CreateUserFormValues) => void;
}

export function UserDialog({
  open,
  onOpenChange,
  mode,
  user,
  onSubmit,
}: UserDialogProps) {
  const isEdit = mode === "edit";
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<CreateUserFormValues>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      role: "ADMIN",
      status: "ACTIVE",
    },
  });

  useEffect(() => {
    if (!open) return;

    if (mode === "create") {
      reset({
        fullName: "",
        email: "",
        password: "",
        role: "ADMIN",
        status: "ACTIVE",
      });
    }

    if (mode === "edit" && user) {
      reset({
        fullName: user.fullName,
        email: user.email,
        password: "",
        role: user.role,
        status: user.status,
      });
    }

    setShowPassword(false);
  }, [open, mode, user, reset]);

  const generatePassword = () => {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%";
    let result = "";
    for (let i = 0; i < 12; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setValue("password", result);
    setShowPassword(true);
  };

  const submit = (data: CreateUserFormValues) => {
    onSubmit(data);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Key className="h-5 w-5" />
            </div>
            <DialogTitle className="text-xl">
              {isEdit ? "Edit User" : "Create New User"}
            </DialogTitle>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit(submit)} autoComplete="off" className="space-y-5 pt-4">
          {/* Full Name */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-xs font-medium uppercase text-muted-foreground">
              <User className="h-3.5 w-3.5" />
              Full Name
            </Label>
            <Input
              placeholder="Full Name"
              className="h-11"
              {...register("fullName")}
            />
            {errors.fullName && (
              <p className="text-xs text-destructive">{errors.fullName.message}</p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-xs font-medium uppercase text-muted-foreground">
              <Mail className="h-3.5 w-3.5" />
              Email Address
            </Label>
            <Input
              type="email"
              placeholder="email"
              className="h-11"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-xs text-destructive">{errors.email.message}</p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-xs font-medium uppercase text-muted-foreground">
              <Key className="h-3.5 w-3.5" />
              {isEdit ? "New Password" : "Password"}
            </Label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter password"
                  className="h-11 pr-10"
                  {...register("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={generatePassword}
                className="h-11 gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Auto-Gen
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              {isEdit
                ? "Leave blank to keep the current password."
                : "Generate a secure password or type your own."}
            </p>
          </div>

          {/* Role & Status (only in create mode) */}
          <div className="grid grid-cols-2 gap-4">
            {/* Role */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-xs font-medium uppercase text-muted-foreground">
                <span className="h-3.5 w-3.5 rounded-full border border-primary/20 bg-primary/5" />
                Role
              </Label>
              <select
                className="flex h-11 w-full items-center justify-between rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                {...register("role")}
              >
                <option value="ADMIN">Admin</option>
                <option value="SUPER_ADMIN">Super Admin</option>
              </select>
              {errors.role && (
                <p className="text-xs text-destructive">{errors.role.message}</p>
              )}
            </div>

            {/* Status */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-xs font-medium uppercase text-muted-foreground">
                <span className="h-3.5 w-3.5 rounded-full border border-primary/20 bg-primary/5" />
                Status
              </Label>
              <select
                className="flex h-11 w-full items-center justify-between rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                {...register("status")}
              >
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
              </select>
              {errors.status && (
                <p className="text-xs text-destructive">{errors.status.message}</p>
              )}
            </div>
          </div>

          <DialogFooter className="pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Discard
            </Button>
            <Button type="submit">
              {isEdit ? "Update User" : "Register User"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
