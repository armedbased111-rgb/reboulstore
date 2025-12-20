import { ReboulSettingsService } from './reboul-settings.service';
export declare class ReboulSettingsController {
    private readonly settingsService;
    constructor(settingsService: ReboulSettingsService);
    getSettings(): Promise<import("./entities/shop.entity").Shop>;
    updateSettings(updateData: any): Promise<import("./entities/shop.entity").Shop>;
}
