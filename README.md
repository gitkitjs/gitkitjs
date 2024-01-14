# gitkitjs
Generate a website from markdown with a minimum of fuss.

1. `pnpm install -D @gitkitjs/gitkitjs`
2. `pnpm gitkitjs dev`
3. Type `o` to open your browser.

More details in the guide at [gitkitjs.dev](https://gitkitjs.dev/guide).

![gitkitjs](static/files/blog/images/gitkitjs.webp)

### This library provides

- A preconfigured [SvelteKit](https://kit.svelte.dev/docs/introduction) app with a [Vite](https://vitejs.dev/) dev server and build.
- [Tailwind CSS](https://tailwindcss.com/docs/installation), and the [Tailwind typography](https://tailwindcss.com/docs/typography-plugin) plugin.
- Markdown rendering based on [Markdoc](https://github.com/markdoc/markdoc).
- A set of built-in website navigation and page components.
- A way to customize the design, and add your own Svelte components.
- Static publishing using the SvelteKit [static adapter](https://kit.svelte.dev/docs/adapter-static).
- TypeScript

### Background

Inspiration for the developer experience of gitkitjs came from [VitePress](https://vitepress.dev/). The main achitectural difference is that gitkitjs can fetch and render markdown dynamically in the browser, similar to [docsify](https://docsify.js.org/#/?id=what-it-is).

### Installation
Use npm, pnpm, or yarn. E.g.

`pnpm install -D @gitkitjs/gitkitjs`

### Usage
- `gitkitjs dev` launches a dev server to render a preview of the website while you edit content.
- `gitkitjs build` produces a static build of the website files.

The gitkitjs project directory can be passed as an argument E.g. `gitkitjs dev docs` when your gitkitjs project lives in the `docs` subdirectory of your repo.

For non-global installs, these commands should be added as package.json scripts E.g.

```json
  "scripts": {
    "dev": "gitkitjs dev",
    "build": "gitkitjs build"
  }
```

### Directories
You can override the default directories with env vars. More details in [gitkit.js](bin/gitkit.js)

- GITKITJS_PROJECT_DIR defaults to current working directory, with other directories below that.
- GITKITJS_CONTENT_DIR is where markdown files live - defaults to `./content`
- GITKITJS_BUILD_DIR is where build output is written - defaults to  `./build`
- GITKITJS_SRC_DIR: is optional, where custom components live - defaults to `./src`
