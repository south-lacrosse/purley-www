# Technical Notes

## Satteri, Remark, and Rehype Plugins

Changes to these don't get automatically picked up if running the dev server. To make sure the server is restarted just touch `/astro.config.ts`, or you may possibly need to stop and restart.

## VSCode

If using the [VSCode](https://code.visualstudio.com/) editor it's recommended to install the Prettier extension, and format on save by adding the following to your `settings.json`:

```json
"editor.formatOnSave": true
```
