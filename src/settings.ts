import EmbedSourceView from '../main';

import { PluginSettingTab, Setting, App } from 'obsidian';

export interface EmbedSourceViewSettings
{
	titleBackgroundColor: string;
	titleForegroundColor: string;
	showTitles: boolean;
}

export const DEFAULT_SETTINGS: EmbedSourceViewSettings =
{
	titleBackgroundColor: "#00000020",
	titleForegroundColor: "",
	showTitles: true
}

export class EmbedSourceViewSettingTab extends PluginSettingTab
{
	plugin: EmbedSourceView;

	constructor(app: App, plugin: EmbedSourceView)
    {
		super(app, plugin);
		this.plugin = plugin;
	}

	display()
    {
		const {containerEl} = this;

		containerEl.empty();

		new Setting(containerEl)
			.setName("Show titles")
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.showTitles)
				.onChange(async (value) => {
					this.plugin.settings.showTitles = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName("Title text")
			.addText(text => text
				.setPlaceholder("Enter a color")
				.setValue(this.plugin.settings.titleForegroundColor)
				.onChange(async (value) => {
					this.plugin.settings.titleForegroundColor = value;
					await this.plugin.saveSettings();
				}));
				
		new Setting(containerEl)
			.setName('Title background')
			.addText(text => text
				.setPlaceholder(DEFAULT_SETTINGS.titleBackgroundColor)
				.setValue(this.plugin.settings.titleBackgroundColor)
				.onChange(async (value) => {
					this.plugin.settings.titleBackgroundColor = value;
					await this.plugin.saveSettings();
				}));
	}
}