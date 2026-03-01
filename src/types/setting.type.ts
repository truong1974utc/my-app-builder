export interface SettingItem {
    id: string;
    createdAt: string;
    updatedAt: string;
    configKey: string;
    description: string;
    configData: Record<string, any>;
}