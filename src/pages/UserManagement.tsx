import { Pagination } from "@/components/common/Pagination";
import { DeleteDialog } from "@/components/dialogs/DeleteDialog";
import { UserDialog } from "@/components/dialogs/UserDialog";
import { PageHeader } from "@/components/layout/PageHeader";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PaginationLimit } from "@/enums/pagination.enum";
import { useToast } from "@/hooks/use-toast";
import { useDebounce } from "@/hooks/useDebounce";
import { usersService } from "@/services/user.service";
import { PaginationMeta } from "@/types/pagination.type";
import { TUser } from "@/types/user.type";
import { Pencil, Search, Trash2, UserPlus } from "lucide-react";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

const UserManagement = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [users, setUsers] = useState<TUser[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [searchValue, setSearchValue] = useState(
    searchParams.get("search") || "",
  );
  const debouncedSearch = useDebounce(searchValue, 500);
  const [selectedUser, setSelectedUser] = useState<TUser | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<TUser | null>(null);
  const [loading, setLoading] = useState(false);

  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(searchParams);

    if (debouncedSearch?.trim()) {
      params.set("search", debouncedSearch.trim());
    } else {
      params.delete("search");
    }

    params.set("page", "1");

    setSearchParams(params);
  }, [debouncedSearch]);

  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    let change = false;
    if (!params.get("page")) {
      params.set("page", "1");
      change = true;
    }
    if (!params.get("limit")) {
      params.set("limit", String(PaginationLimit.TEN));
      change = true;
    }
    if (change) {
      setSearchParams(params);
    }
  }, [searchParams]);

  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || PaginationLimit.TEN;
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<"create" | "edit">("create");
  const { toast } = useToast();

  const fetchUsers = async () => {
    try {
      setLoading(true);

      const data = await usersService.getUsers(searchParams as any);

      setUsers(data.items);
      setMeta(data.meta);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch users",
        variant: "destructive",
      })
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!page || !limit) return;
    fetchUsers();
  }, [searchParams]);

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", String(newPage));
    setSearchParams(params);
  };

  const handleSubmitUser = async (data: any) => {
    try {
      if (dialogMode === "create") {
        await usersService.createUser(data);
      }

      if (dialogMode === "edit" && selectedUser) {
        await usersService.updateUser(selectedUser?.id, data);
      }

      await fetchUsers();

    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch users",
        variant: "destructive",
      })
    }
  }

  const handleConfirmDelete = async () => {
    if (!userToDelete) return;

    try {
      setDeletingId(userToDelete.id);
      await usersService.deleteUser(userToDelete.id);
      await fetchUsers();
    } finally {
      setDeletingId(null);
      setUserToDelete(null);
      setDeleteDialogOpen(false);
    }
  };

  const handleAddUser = () => {
    setDialogMode("create");
    setSelectedUser(null);
    setDialogOpen(true);
  };

  const handleEditUser = (user: TUser) => {
    setDialogMode("edit");
    setSelectedUser(user);
    setDialogOpen(true);
  };

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="User Management"
        description="System management and detailed overview."
      />

      {/* Search and Add */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <div className="relative max-w-md flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button className="gap-2" onClick={handleAddUser}>
          <UserPlus className="h-4 w-4" />
          Add User
        </Button>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-border bg-card shadow-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="font-semibold">USER</TableHead>
              <TableHead className="font-semibold">ROLE</TableHead>
              <TableHead className="font-semibold">STATUS</TableHead>
              <TableHead className="font-semibold text-right">
                ACTIONS
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-10">
                  <div className="flex items-center justify-center gap-2 text-muted-foreground">
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                    Loading users...
                  </div>
                </TableCell>
              </TableRow>
            ) : users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-10 text-muted-foreground">
                  No users found.
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow
                  key={user.id}
                  className="hover:bg-muted/30 transition-colors"
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback>
                          {user.fullName?.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{user.fullName}</p>
                        <p className="text-sm text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell>
                    <Badge
                      variant={
                        user.role === "SUPER_ADMIN"
                          ? "default"
                          : "secondary"
                      }
                    >
                      {user.role}
                    </Badge>
                  </TableCell>

                  <TableCell>
                    <span
                      className={
                        user.status === "ACTIVE"
                          ? "text-success"
                          : "text-muted-foreground"
                      }
                    >
                      {user.status}
                    </span>
                  </TableCell>

                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEditUser(user)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>

                      {user.role !== "SUPER_ADMIN" && (
                        <Button
                          variant="ghost"
                          size="icon"
                          disabled={deletingId === user.id}
                          onClick={() => {
                            setUserToDelete(user);
                            setDeleteDialogOpen(true);
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Pagination
        page={page}
        totalPages={meta?.totalPages || 1}
        onPageChange={handlePageChange}
      />

      {/* User Dialog */}
      <UserDialog
        open={dialogOpen}
        mode={dialogMode}
        user={selectedUser}
        onOpenChange={setDialogOpen}
        onSubmit={handleSubmitUser}
      />

      {/* Delete Dialog */}
      <DeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete User"
        itemName={userToDelete?.fullName || ""}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};

export default UserManagement;
