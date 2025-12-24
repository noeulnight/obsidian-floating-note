import { Plugin, TFile, moment } from "obsidian";
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
			id: "open-note-floating-window",
			name: "Open new tab in floating window",
			icon: "popup-open",
			callback: () => this.createLeafWindow(),
		});

		this.addCommand({
			id: "open-current-note-floating-window",
			name: "Open current tab in floating window",
			icon: "popup-open",
			callback: () => {
				const activeFile =
					this.app.workspace.getActiveFile() ?? undefined;
				void this.createLeafWindow(activeFile);
			},
		});

		this.addRibbonIcon("popup-open", "Open note in floating window", () => {
			void this.createLeafWindow();
		});

		this.addSettingTab(new FloatingNoteSettingTab(this.app, this));
	}

	async createFile(): Promise<TFile> {
		const fileName = moment().format(this.settings.fileNameFormat) + ".md";
		const folderPath = this.settings.fileFolderPath.trim();
		const fullPath = folderPath ? `${folderPath}/${fileName}` : fileName;

		const exists = this.app.vault.getFileByPath(fullPath);
		if (exists) return exists;

		return await this.app.vault.create(fullPath, "");
	}

	async createLeafWindow(targetFile?: TFile) {
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
				electronWindow.setSize(350, 700);
				electronWindow.setAlwaysOnTop(true, "screen-saver");
				electronWindow.setOpacity(0.95);
				await electronWindow.webContents.executeJavaScript(`
						// Inject persistent styles
						const styleId = 'floating-note-styles';
						if (!document.getElementById(styleId)) {
							const style = document.createElement('style');
							style.id = styleId;
							style.textContent = \`
								.view-actions {
									display: none !important;
								}
								.workspace-tab-header-container {
									display: none !important;
								}
								.view-header-left {
									display: none !important;
								}
								.view-header {
									-webkit-app-region: drag !important;
									cursor: grab !important;
								}
								.view-header:active {
									cursor: grabbing !important;
								}
							\`;
							document.head.appendChild(style);
						}

						// Apply styles to existing elements
						const applyStyles = () => {
							const tabContainers = document.querySelectorAll('.workspace-tab-header-container');
							tabContainers.forEach(container => container.style.display = 'none');

							const viewButtons = document.querySelectorAll('.view-header-left');
							viewButtons.forEach(button => button.style.display = 'none');

							const viewHeaders = document.querySelectorAll('.view-header');
							viewHeaders.forEach(header => {
								header.style.webkitAppRegion = 'drag';
								header.style.cursor = 'grab';
							});
						};

						applyStyles();

						// Watch for DOM changes and reapply styles
						const observer = new MutationObserver(() => {
							applyStyles();
						});

						observer.observe(document.body, {
							childList: true,
							subtree: true
						});
					`);
			}
		}

		const file = targetFile ? targetFile : await this.createFile();
		await leafWindow.openFile(file);
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
