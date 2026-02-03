import { useState } from "react";
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

interface Setting {
  id: string;
  key: string;
  description: string;
  value?: string;
}

const initialSettings: Setting[] = [
  { 
    id: "1", 
    key: "auth_session_timeout", 
    description: "Duration of an active user session.",
    value: '{\n  "timeout": 3600000\n}'
  },
];

const SettingsPage = () => {
  const [settings, setSettings] = useState(initialSettings);
  const [searchTerm, setSearchTerm] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedSetting, setSelectedSetting] = useState<Setting | null>(null);
  const [settingToDelete, setSettingToDelete] = useState<Setting | null>(null);
  const { toast } = useToast();

  const filteredSettings = settings.filter(
    (setting) =>
      setting.key.toLowerCase().includes(searchTerm.toLowerCase()) ||
      setting.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

  const handleSubmit = (data: Omit<Setting, "id"> & { id?: string }) => {
    if (data.id) {
      // Update existing
      setSettings(settings.map((s) => 
        s.id === data.id ? { ...s, ...data } : s
      ));
      toast({ title: "Setting updated", description: `${data.key} has been updated.` });
    } else {
      // Create new
      const newSetting: Setting = {
        id: Date.now().toString(),
        key: data.key,
        description: data.description,
        value: data.value,
      };
      setSettings([...settings, newSetting]);
      toast({ title: "Setting created", description: `${data.key} has been added.` });
    }
  };

  const handleDeleteConfirm = () => {
    if (settingToDelete) {
      setSettings(settings.filter((s) => s.id !== settingToDelete.id));
      toast({ title: "Setting deleted", description: `${settingToDelete.key} has been removed.` });
      setSettingToDelete(null);
    }
  };

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="System Settings"
        description="System management and detailed overview."
      />

      {/* Search and Add */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <div className="relative max-w-md flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search keys or descriptions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button className="gap-2" onClick={handleCreateClick}>
          <Plus className="h-4 w-4" />
          Add Setting
        </Button>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-border bg-card shadow-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="font-semibold">KEY</TableHead>
              <TableHead className="font-semibold">DESCRIPTION</TableHead>
              <TableHead className="font-semibold text-right">ACTIONS</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredSettings.map((setting) => (
              <TableRow key={setting.id} className="hover:bg-muted/30 transition-colors">
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                      <Terminal className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <span className="font-mono text-sm text-foreground">{setting.key}</span>
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

      {/* Settings Dialog */}
      <SettingsDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        setting={selectedSetting}
        onSubmit={handleSubmit}
      />

      {/* Delete Dialog */}
      <DeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete Setting"
        itemName={settingToDelete?.key || ""}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
};

export default SettingsPage;
