import { Menu, Plugin } from "obsidian";
import {
	DEFAULT_SETTINGS,
	FloatingNoteSettings,
	FloatingNoteSettingTab,
} from "./settings";
import remote from "@electron/remote";

export default class FloatingNote extends Plugin {
	settings: FloatingNoteSettings;

	async onload() {
		await this.loadSettings();

		this.addCommand({
			id: "open-floating-note-window",
			name: "Open floating note window",
			icon: "popup-open",
			callback: () => this.createLeafWindow(),
		});

		this.addRibbonIcon("popup-open", "Open floating note window", () => {
			void this.createLeafWindow();
		});

		this.addSettingTab(new FloatingNoteSettingTab(this.app, this));
	}

	async createLeafWindow() {
		const existingWindowIds = remote.BrowserWindow.getAllWindows().map(
			(win) => win.id
		);

		const leafWindow = this.app.workspace.getLeaf("window");

		this.app.workspace.setActiveLeaf(leafWindow, { focus: true });

		const newWindowIds = remote.BrowserWindow.getAllWindows().map(
			(win) => win.id
		);
		const createdWindowId = newWindowIds.find(
			(id) => !existingWindowIds.includes(id)
		);

		if (createdWindowId) {
			const electronWindow = remote.BrowserWindow.fromId(createdWindowId);
			if (electronWindow) {
				electronWindow.setAlwaysOnTop(true, "screen-saver");
				electronWindow.setOpacity(0.95);
				await electronWindow.webContents.executeJavaScript(`
						// Hide individual tab buttons
						const tabButtons = document.querySelectorAll('.workspace-tab-header');
						tabButtons.forEach(tab => {
							tab.style.display = 'none';
						});

						// Hide new tab button and other controls
						const newTabButtons = document.querySelectorAll('.workspace-tab-header-new-tab');
						newTabButtons.forEach(btn => {
							btn.style.display = 'none';
						});

						// Minimize tab header height but keep it draggable
						const tabContainers = document.querySelectorAll('.workspace-tab-header-container');
						tabContainers.forEach(container => {
							container.style.minHeight = '40px';
							container.style.height = '40px';
							container.style.backgroundColor = 'transparent';
							container.style.borderBottom = 'none';
						});
					`);
			}
		}
	}

	onunload() {}

	async loadSettings() {
		this.settings = Object.assign(
			{},
			DEFAULT_SETTINGS,
			(await this.loadData()) as Partial<FloatingNoteSettings>
		);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}
