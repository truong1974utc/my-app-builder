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

type FormValues = {
  name: string;
  email: string;
  password: string;
};

interface UserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "create" | "edit";
  user?: {
    id: string;
    fullName: string;
    email: string;
  };
  onSubmit: (data: { name: string; email: string; password: string }) => void;
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
  } = useForm<FormValues>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    if (!open) return;

    if (mode === "create") {
      reset({
        name: "",
        email: "",
        password: "",
      });
    }

    if (mode === "edit" && user) {
      reset({
        name: user.fullName,
        email: user.email,
        password: "",
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

  const submit = (data: FormValues) => {
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
              {...register("name", { required: "Name is required" })}
            />
            {errors.name && (
              <p className="text-xs text-destructive">{errors.name.message}</p>
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
              {...register("email", {
                required: "Email is required",
              })}
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
                  {...register("password", {
                    required: !isEdit ? "Password is required" : false,
                  })}
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
