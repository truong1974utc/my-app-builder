import { useState, useEffect } from "react";
import { Settings, Info, X, Code } from "lucide-react";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface Setting {
  id: string;
  key: string;
  description: string;
  value?: string;
}

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  setting: Setting | null;
  onSubmit: (data: Omit<Setting, "id"> & { id?: string }) => void;
}

export function SettingsDialog({
  open,
  onOpenChange,
  setting,
  onSubmit,
}: SettingsDialogProps) {
  const [key, setKey] = useState("");
  const [description, setDescription] = useState("");
  const [jsonValue, setJsonValue] = useState("{\n\n}");
  const [isValidJson, setIsValidJson] = useState(true);

  const isEditing = !!setting;

  useEffect(() => {
    if (setting) {
      setKey(setting.key);
      setDescription(setting.description);
      setJsonValue(setting.value || "{\n\n}");
    } else {
      setKey("");
      setDescription("");
      setJsonValue("{\n\n}");
    }
    setIsValidJson(true);
  }, [setting, open]);

  const validateJson = (value: string) => {
    try {
      JSON.parse(value);
      setIsValidJson(true);
    } catch {
      setIsValidJson(false);
    }
    setJsonValue(value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidJson) return;
    
    onSubmit({
      id: setting?.id,
      key,
      description,
      value: jsonValue,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] p-0 gap-0">
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Settings className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-foreground">
                {isEditing ? "Update Setting" : "Create New Configuration"}
              </h2>
              <p className="text-sm text-muted-foreground">
                Configure system-wide variables and objects.
              </p>
            </div>
          </div>
<<<<<<< HEAD
          {/* <Button
=======
          <Button
>>>>>>> 7ff2db269d6f8e780f016f7ffc439452cdee141e
            variant="ghost"
            size="icon"
            className="h-9 w-9"
            onClick={() => onOpenChange(false)}
          >
            <X className="h-5 w-5" />
<<<<<<< HEAD
          </Button> */}
=======
          </Button>
>>>>>>> 7ff2db269d6f8e780f016f7ffc439452cdee141e
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Key and Description Row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Configuration Key</Label>
              <Input
                placeholder="e.g. system_maintenance_mode"
                value={key}
                onChange={(e) => setKey(e.target.value)}
                className="h-11 font-mono text-sm"
                required
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">Short Description</Label>
              <Input
                placeholder="What does this config do?"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="h-11"
              />
            </div>
          </div>

          {/* JSON Editor */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="flex items-center gap-2 text-sm font-medium">
                <Code className="h-4 w-4" />
                Configuration Data (JSON)
              </Label>
              <span className={`text-xs font-medium ${isValidJson ? "text-success" : "text-destructive"}`}>
                {isValidJson ? "Valid Format" : "Invalid JSON"}
              </span>
            </div>
            <div className="relative">
              <textarea
                value={jsonValue}
                onChange={(e) => validateJson(e.target.value)}
                className="w-full min-h-[200px] p-4 font-mono text-sm bg-[#1e1e2e] text-[#cdd6f4] rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                placeholder='{\n  "key": "value"\n}'
                spellCheck={false}
              />
            </div>
          </div>

          {/* Info Banner */}
          <div className="flex items-start gap-3 rounded-lg bg-muted/50 p-4 border">
            <Info className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
            <div className="text-sm text-muted-foreground">
              <p className="font-medium mb-1">JSON FORMATTING RULES:</p>
              <ul className="list-disc list-inside space-y-0.5">
                <li>Use double quotes for all keys and string values.</li>
                <li>Trailing commas are not permitted.</li>
                <li>Ensure all brackets and braces are correctly closed.</li>
              </ul>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={!key.trim() || !isValidJson}>
              {isEditing ? "Update Config" : "Save Setting"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
