# Embed Source View - Plugin

This is a plugin for Obsidian.md which lets you keep your snippets of code in sync with your source files.
Create a code fence with "embed-view" as the language, the content of which will be YAML.
The plugin supports the following fields:

- `INFO` contains the language and whatever else you want there to be before the content of the file
- `PATH` path of the file to embed, it can be either local or http/https
- `TITLE` (optional) if specified, this will be the title of the block otherwise it will use the file path
- `LINES` (optional) number or string containing a comma-separated list of ranges. (e.g. "29-100, 104, 1034-420")