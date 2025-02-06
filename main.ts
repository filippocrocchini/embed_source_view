import { Plugin, MarkdownRenderer, MarkdownView, TFile, parseYaml, requestUrl } from 'obsidian';
import { EmbedSourceViewSettings, EmbedSourceViewSettingTab, DEFAULT_SETTINGS } from "./src/settings";
import { parseRanges, extractRanges } from "./src/utils";

export default class EmbedSourceView extends Plugin
{
    settings: EmbedSourceViewSettings;

	async onload()
	{
		await this.loadSettings();

		this.addSettingTab(new EmbedSourceViewSettingTab(this.app, this));

		this.registerRenderer();
	}

	async loadSettings()
	{
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings()
	{
		await this.saveData(this.settings);
	}

	async registerRenderer()
	{
		this.registerMarkdownCodeBlockProcessor(`embed-view`, async (meta, root_element, context) => {
			let metaYaml
			try {
				metaYaml = parseYaml(meta);
			}
			catch(e)
			{
				await MarkdownRenderer.render(this.app, "`ERROR: invalid embedding (invalid YAML)`", root_element, '', this);
				return;
			}
			
			const srcPath = metaYaml.PATH as string
			if (!srcPath)
			{
				await MarkdownRenderer.render(this.app, "`ERROR: invalid source path`", root_element, '', this);
				return;
			}

			let fileContent
			try
			{
				fileContent = await fetchFileContent(metaYaml.PATH);
			}
			catch(e)
			{
				await MarkdownRenderer.render(this.app, e, root_element, '', this);
				return;
			}

			let   markdownSource = fileContent
			const lang           = (metaYaml.INFO as string)?.trim();
			const lineRanges     = parseRanges(metaYaml.LINES);

			if (lineRanges.length)
			{
				markdownSource = extractRanges(fileContent, lineRanges);	
			}

			await MarkdownRenderer.render(this.app, '```' + lang + '\n' + markdownSource + '\n```', root_element, '', this);
				
			let title = metaYaml.TITLE as string;
			if (!title) 
			{
				title = srcPath;
			}

			if (this.settings.showTitles && title.length > 0)
			{
				addTitle(root_element, title, this.settings);
			}
		});
	}
}

async function fetchFileContent(path: string): Promise<string>
{
	if (path.startsWith("https://") || path.startsWith("http://"))
	{
		try
		{
			const httpResp = await requestUrl({url: path, method: "GET"});
			return httpResp.text;
		}
		catch(e)
		{
			throw `\`ERROR: could't fetch '${path}'\``;
		}
	}
	
	const tFile = this.app.vault.getAbstractFileByPath(path);
	
	if (tFile instanceof TFile)
	{
		return await this.app.vault.read(tFile);
	}

	throw `\`ERROR: could't read file '${path}'\``;
}

function addTitle(parent: Element, title: string, settings: EmbedSourceViewSettings)
{
	const titleElement = document.createElement("span");
	
	titleElement.appendText(title);
	titleElement.setAttribute("tabindex", "-1");

	const style = titleElement.style
	style.color           = settings.titleForegroundColor
	style.backgroundColor = settings.titleBackgroundColor
	
	titleElement.className = "internal-embed file-embed mod-generic is-loaded";

	parent.prepend(titleElement);
}
