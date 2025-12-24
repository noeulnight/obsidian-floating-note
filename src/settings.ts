import { App, PluginSettingTab, Setting } from "obsidian";
import FloatingNote from "./main";

export interface FloatingNoteSettings {
	fileNameFormat: string;
	fileFolderPath: string;
	opacity: number;
}

export const DEFAULT_SETTINGS: FloatingNoteSettings = {
	fileNameFormat: "YYYY-MM-DD HH:mm:ss",
	fileFolderPath: "",
	opacity: 9.5,
};

export class FloatingNoteSettingTab extends PluginSettingTab {
	plugin: FloatingNote;

	constructor(app: App, plugin: FloatingNote) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		new Setting(containerEl)
			.setName("Title format")
			.setDesc("Format for naming new floating note files.")
			.addText((text) =>
				text
					.setPlaceholder("Enter filename format")
					.setValue(this.plugin.settings.fileNameFormat)
					.onChange(async (value) => {
						this.plugin.settings.fileNameFormat = value;
						await this.plugin.saveSettings();
					})
			);

		new Setting(containerEl)
			.setName("Folder path")
			.setDesc(
				"Folder path to save new floating note files. Leave empty to save in the vault root."
			)
			.addDropdown((dropdown) => {
				const folders = this.app.vault.getAllFolders();

				folders.forEach((folder) => {
					dropdown.addOption(folder.path, folder.path);
				});

				dropdown.setValue(this.plugin.settings.fileFolderPath);
				dropdown.onChange(async (value) => {
					this.plugin.settings.fileFolderPath = value;
					await this.plugin.saveSettings();
				});
			});

		new Setting(containerEl)
			.setName("Window opacity")
			.setDesc(
				"Set the opacity of the floating note window (0.1 to 1.0)."
			)
			.addSlider((slider) =>
				slider
					.setLimits(0.1, 1, 0.05)
					.setValue(this.plugin.settings.opacity)
					.onChange(async (value) => {
						this.plugin.settings.opacity = value;
						await this.plugin.saveSettings();
					})
					.showTooltip()
			);
	}
}
