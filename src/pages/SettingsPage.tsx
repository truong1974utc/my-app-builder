import { Pagination } from "@/components/common/Pagination";
import { DeleteDialog } from "@/components/dialogs/DeleteDialog";
import { SettingsDialog } from "@/components/dialogs/SettingsDialog";
import { PageHeader } from "@/components/layout/PageHeader";
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
import { systemSettingService } from "@/services/setting.service";
import { PaginationMeta } from "@/types/pagination.type";
import { SettingItem } from "@/types/setting.type";
import { Pencil, Plus, Search, Terminal, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

const SettingsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [settings, setSettings] = useState<SettingItem[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchValue, setSearchValue] = useState(searchParams.get("search") || "");
  const debouncedSearch = useDebounce(searchValue, 500);
  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || PaginationLimit.TEN;
  const search = searchParams.get("search") || undefined;
  const sortBy = searchParams.get("sortBy") || undefined;
  const sortOrder = searchParams.get("sortOrder") as "ASC" | "DESC" | undefined;
  const [dialogMode, setDialogMode] = useState<'create' | 'edit'>('create');
  const [selectedSetting, setSelectedSetting] = useState<SettingItem | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    if (debouncedSearch?.trim())
      params.set("search", debouncedSearch.trim());
    else {
      params.delete("search");
    }
    params.set("page", "1"); // Reset to first page on search
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

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const data = await systemSettingService.getSystemSettings(searchParams as any);
      setSettings(data.items);
      setMeta(data.meta);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch settings",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!page || !limit) return;
    fetchSettings();
  }, [searchParams]);

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", String(newPage));
    setSearchParams(params);
  };

  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [settingToDelete, setSettingToDelete] = useState<SettingItem | null>(null);
  const { toast } = useToast();

  const handleCreateClick = () => {
    setDialogMode('create');
    setSelectedSetting(null);
    setDialogOpen(true);
  };

  const handleEditClick = (setting: SettingItem) => {
    setDialogMode('edit');
    setSelectedSetting(setting);
    setDialogOpen(true);
  };

  const handleDeleteClick = (setting: SettingItem) => {
    setSettingToDelete(setting);
    setDeleteDialogOpen(true);
  };

  const handleSubmit = async (data: any) => {
    try {
      if (dialogMode === 'create') {
        await systemSettingService.createSystemSetting(data);
        toast({
          title: "Success",
          description: "Setting created successfully",
          variant: "default",
        });
      } else if (dialogMode === 'edit' && selectedSetting) {
        await systemSettingService.updateSystemSetting(selectedSetting.id, data);
        toast({
          title: "Success",
          description: "Setting updated successfully",
          variant: "default",
        });
      }
      await fetchSettings();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save setting",
        variant: "destructive",
      });
    }
  };

  const handleDeleteConfirm = async () => {
    if (!settingToDelete) return;
    try {
      await systemSettingService.deleteSystemSetting(settingToDelete.id);
      toast({
        title: "Success",
        description: "Setting deleted successfully",
        variant: "default",
      });
      await fetchSettings();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete setting",
        variant: "destructive",
      });
    }
    setDeleteDialogOpen(false);
    setSettingToDelete(null);
  };

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="System Settings"
        description="System management and detailed overview."
      />

      <div className="flex items-center justify-between gap-4 mb-6">
        <div className="relative max-w-md flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search keys or descriptions..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="pl-10"
          />
        </div>

        <Button className="gap-2" onClick={handleCreateClick}>
          <Plus className="h-4 w-4" />
          Add Setting
        </Button>
      </div>

      <div className="rounded-xl border border-border bg-card shadow-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="font-semibold">KEY</TableHead>
              <TableHead className="font-semibold">DESCRIPTION</TableHead>
              <TableHead className="font-semibold text-right">
                ACTIONS
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {settings.map((setting) => (
              <TableRow
                key={setting.id}
                className="hover:bg-muted/30 transition-colors"
              >
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                      <Terminal className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <span className="font-mono text-sm text-foreground">
                      {setting.configKey}
                    </span>
                  </div>
                </TableCell>

                <TableCell className="text-muted-foreground">
                  {setting.description}
                </TableCell>

                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleEditClick(setting)}
                    >
                      <Pencil className="h-4 w-4 text-muted-foreground" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleDeleteClick(setting)}
                    >
                      <Trash2 className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {meta && (
        <Pagination
          page={page}
          totalPages={meta?.totalPages || 1}
          onPageChange={handlePageChange}
        />
      )}

      <SettingsDialog
        open={dialogOpen}
        mode={dialogMode}
        onOpenChange={setDialogOpen}
        setting={selectedSetting}
        onSubmit={handleSubmit}
      />

      <DeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete Setting"
        itemName={settingToDelete?.configKey || ""}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
};

export default SettingsPage;