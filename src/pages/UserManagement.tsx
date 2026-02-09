import { useEffect, useState } from "react";
import { Search, UserPlus, Pencil, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { UserDialog } from "@/components/dialogs/UserDialog";
import { DeleteDialog } from "@/components/dialogs/DeleteDialog";
import { User } from "@/types/user.type";
import { Pagination } from "@/components/common/Pagination";
import { usersService } from "@/services/users/user.service";
import { PaginationMeta } from "@/types/pagination.type";
import { PaginationLimit } from "@/enums/pagination.enum";
import { usePagination } from "@/hooks/usePagination";

const UserManagement = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<"create" | "edit">("create");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const { page, limit, debouncedSearch, setPage, search, setSearch } =
    usePagination(PaginationLimit.TEN);

  const [users, setUsers] = useState<User[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);

  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await usersService.getUsers({
        page,
        limit,
        search: debouncedSearch || undefined,
      });

      setUsers(res.data.items);
      setMeta(res.data.meta);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, limit, debouncedSearch]);

  const createUser = async (payload: {
    fullName: string;
    email: string;
    password: string;
    role: string;
    status: string;
  }) => {
    setCreating(true);
    try {
      await usersService.createUser(payload);
      await fetchUsers();
    } finally {
      setCreating(false);
    }
  };

  const updateUser = async (
    id: string,
    payload: {
      fullName: string;
      email: string;
      password?: string;
    },
  ) => {
    setCreating(true);
    try {
      await usersService.updateUser(id, payload);
      await fetchUsers();
    } finally {
      setCreating(false);
    }
  };

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

  const filteredUsers = users.filter(
    (user) =>
      user.fullName.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase()),
  );

  const handleAddUser = () => {
    setDialogMode("create");
    setSelectedUser(null);
    setDialogOpen(true);
  };

  const handleEditUser = (user: User) => {
    setDialogMode("edit");
    setSelectedUser(user);
    setDialogOpen(true);
  };

  const handleDeleteClick = (user: User) => {
    setUserToDelete(user);
    setDeleteDialogOpen(true);
  };

  // const handleUserSubmit = (data: { name: string; email: string; password: string }) => {
  //   if (dialogMode === "create") {
  //     const newUser: User = {
  //       id: Date.now().toString(),
  //       name: data.name,
  //       email: data.email,
  //       role: "ADMIN",
  //       status: "Active",
  //       avatar: data.name.charAt(0).toUpperCase(),
  //     };
  //     setUsers([...users, newUser]);
  //     toast({ title: "User created", description: `${data.name} has been added successfully.` });
  //   } else if (selectedUser) {
  //     setUsers(users.map((u) =>
  //       u.id === selectedUser.id
  //         ? { ...u, name: data.name, email: data.email, avatar: data.name.charAt(0).toUpperCase() }
  //         : u
  //     ));
  //     toast({ title: "User updated", description: `${data.name} has been updated successfully.` });
  //   }
  // };

  // const handleDeleteConfirm = () => {
  //   if (userToDelete) {
  //     setUsers(users.filter((u) => u.id !== userToDelete.id));
  //     toast({ title: "User deleted", description: `${userToDelete.name} has been removed.` });
  //     setUserToDelete(null);
  //   }
  // };

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
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button className="gap-2" onClick={handleAddUser}>
          <UserPlus className="h-4 w-4" />
          Add User
        </Button>
      </div>

      {loading && (
        <div className="py-10 text-center text-muted-foreground">
          Loading users...
        </div>
      )}

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
            {filteredUsers.map((user) => (
              <TableRow
                key={user.id}
                className="hover:bg-muted/30 transition-colors"
              >
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-muted text-muted-foreground font-medium">
                        {user.avatarUrl}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-foreground">
                        {user.fullName}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      user.role === "SUPER_ADMIN" ? "default" : "secondary"
                    }
                  >
                    {user.role}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span
                      className={`h-2 w-2 rounded-full ${
                        user.status === "ACTIVE"
                          ? "bg-success"
                          : "bg-muted-foreground"
                      }`}
                    />
                    <span
                      className={
                        user.status === "ACTIVE"
                          ? "text-success"
                          : "text-muted-foreground"
                      }
                    >
                      {user.status}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleEditUser(user)}
                    >
                      <Pencil className="h-4 w-4 text-muted-foreground" />
                    </Button>
                    {user.role !== "SUPER_ADMIN" && (
                      <Button
                        variant="ghost"
                        size="icon"
                        disabled={deletingId === user.id}
                        className="h-8 w-8"
                        onClick={() => {
                          setUserToDelete(user);
                          setDeleteDialogOpen(true);
                        }}
                      >
                        <Trash2 className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Pagination
        page={page}
        totalPages={meta?.totalPages || 1}
        onPageChange={setPage}
      />

      {/* User Dialog */}
      <UserDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        mode={dialogMode}
        user={selectedUser || undefined}
        onSubmit={async (data) => {
          if (dialogMode === "create") {
            await createUser({
              fullName: data.name,
              email: data.email,
              password: data.password,
              role: "ADMIN",
              status: "ACTIVE",
            });
          }

          if (dialogMode === "edit" && selectedUser) {
            const payload: any = {
              fullName: data.name,
              email: data.email,
            };

            if (data.password?.trim()) {
              payload.password = data.password;
            }

            await updateUser(selectedUser.id, payload);
          }

          setDialogOpen(false);
        }}
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
