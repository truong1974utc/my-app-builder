import { useEffect, useState } from "react";
import { Search, Plus, Pencil, Trash2, Terminal } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { SettingsDialog } from "@/components/dialogs/SettingsDialog";
import { DeleteDialog } from "@/components/dialogs/DeleteDialog";
import { useToast } from "@/hooks/use-toast";
import { useSearchParams } from "react-router-dom";
import { systemSettingService } from "@/services/settings/setting.service";
import { PaginationMeta } from "@/types/pagination.type";

interface Setting {
  id: string;
  configKey: string;
  description: string;
  configData: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

const SettingsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 10;
  const search = searchParams.get("search") || undefined;
  const sortBy = searchParams.get("sortBy") || undefined;
  const sortOrder =
    (searchParams.get("sortOrder") as "ASC" | "DESC") || undefined;

  const [settings, setSettings] = useState<Setting[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedSetting, setSelectedSetting] = useState<Setting | null>(null);
  const [settingToDelete, setSettingToDelete] = useState<Setting | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchSettings();
  }, [searchParams]);

  const fetchSettings = async () => {
    try {
      const params: any = {
        page,
        limit,
      };

      if (search) params.search = search;
      if (sortBy) params.sortBy = sortBy;
      if (sortOrder) params.sortOrder = sortOrder;

      const res = await systemSettingService.getSystemSettings(params);

      setSettings(res.data.items);
      setMeta(res.data.meta);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch settings",
        variant: "destructive",
      });
    }
  };

  const handleCreateClick = () => {
    setSelectedSetting(null);
    setDialogOpen(true);
  };

  const handleEditClick = (setting: Setting) => {
    setSelectedSetting(setting);
    setDialogOpen(true);
  };

  const handleDeleteClick = (setting: Setting) => {
    setSettingToDelete(setting);
    setDeleteDialogOpen(true);
  };

  const handleSubmit = async (data: {
    id?: string;
    configKey: string;
    description: string;
    configData: Record<string, any>;
  }) => {
    try {
      if (data.id) {
        await systemSettingService.updateSystemSetting(data.id, {
          configKey: data.configKey,
          description: data.description,
          configData: data.configData,
        });

        toast({
          title: "Setting updated",
          description: `${data.configKey} updated successfully.`,
        });
      } else {
        await systemSettingService.createSystemSetting({
          configKey: data.configKey,
          description: data.description,
          configData: data.configData,
        });

        toast({
          title: "Setting created",
          description: `${data.configKey} created successfully.`,
        });
      }

      fetchSettings();
      setDialogOpen(false);
    } catch {
      toast({
        title: "Error",
        description: "Operation failed",
        variant: "destructive",
      });
    }
  };

  

  const handleDeleteConfirm = async () => {
    if (!settingToDelete) return;

    try {
      await systemSettingService.deleteSystemSetting(settingToDelete.id);

      toast({
        title: "Setting deleted",
        description: `${settingToDelete.configKey} removed.`,
      });

      fetchSettings();
      setDeleteDialogOpen(false);
    } catch {
      toast({
        title: "Error",
        description: "Delete failed",
        variant: "destructive",
      });
    }
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
            defaultValue={search}
            onChange={(e) => {
              const value = e.target.value;

              const params: any = {
                page: 1,
                limit,
              };

              if (value) params.search = value;
              if (sortBy) params.sortBy = sortBy;
              if (sortOrder) params.sortOrder = sortOrder;

              setSearchParams(params);
            }}
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

      <SettingsDialog
        open={dialogOpen}
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