#!/usr/bin/env node

// CLI for gitkitjs
// Sets environment variables and launches vite dev/build/preview.
// TODO: add support for other npm scripts (e.g. check, test...)

import child_process from 'node:child_process';

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import process from 'node:process';
import url from 'node:url';

let __dirname = path.dirname(url.fileURLToPath(import.meta.url));

let binDir = path.resolve(__dirname, '..', 'node_modules', '.bin');
let viteFile = path.resolve(binDir, 'vite');

if (!fs.existsSync(viteFile)) {
  // Try npm layout
  let binDir2 = path.resolve(__dirname, '..', '..', '..', '.bin');
  viteFile = path.resolve(binDir2, 'vite');
  if (!fs.existsSync(viteFile)) {
    console.error(`Could not find vite executable in ${binDir} or ${binDir2}`);
    process.exit(1);
  } else {
    binDir = binDir2;
  }
}

let viteCommand = process.argv[2] || 'dev';
let packageDir = path.resolve(__dirname, '..');
let pkg = JSON.parse(fs.readFileSync(path.join(packageDir, 'package.json'), 'utf8'));

// https://vitepress.dev/guide/routing#project-root
// defaults to cwd
// override with cli arg or GITKITJS_PROJECT_DIR
let projectDir = path.resolve('.', process.argv[3] ?? process.env.GITKITJS_PROJECT_DIR ?? '');

// Similar to project-root/.vitepress directory
// defaults to projectDir/src
// override with GITKITJS_SRC_DIR, resolved relative to projectDir
// Optional:
// - use app.config.js or app.config.ts for custom components
// - use tailwind.config.js (note: cjs - not esm) for tailwind config
// - restart dev server after creating directory or renaming config file.
let srcDir = path.resolve(projectDir, process.env.GITKITJS_SRC_DIR ?? 'src');
if (!fs.existsSync(srcDir)) {
  srcDir = undefined;
}

let configDir = srcDir;
if (
  !srcDir ||
  (!fs.existsSync(path.join(srcDir, 'app.config.js')) &&
    !fs.existsSync(path.join(srcDir, 'app.config.ts')))
) {
  configDir = undefined;
}

// https://vitepress.dev/guide/routing#source-directory
// defaults to projectDir/content
// override with GITKITJS_CONTENT_DIR, resolved relative to projectDir
let contentDir = path.resolve(projectDir, process.env.GITKITJS_CONTENT_DIR ?? 'content');
let contentDirExists = fs.existsSync(contentDir);
if (!contentDirExists) {
  console.log(`No content directory found at ${contentDir} - using static files from package.`);
  contentDir = path.join(packageDir, 'static', 'files');
}

// Create staticDir in temp directory
let staticDir = fs.mkdtempSync(path.join(os.tmpdir(), 'gitkitjs-'));
// add staticDir/files
fs.mkdirSync(path.join(staticDir, 'files'));
// symlink contentDir/* into staticDir/files (not including dotted or static/*)
// NOTE: users should be warned that the contentDir is included in the build.
overlayStaticDir(contentDir, path.join(staticDir, 'files'), ['static']);

// overlay staticDir -> contentDir/static/*
if (contentDirExists) {
  let contentStaticDir = path.join(contentDir, 'static');
  if (fs.existsSync(contentStaticDir)) {
    overlayStaticDir(contentStaticDir, staticDir);
  }
}

// overlay staticDir -> srcDir/static/*
if (srcDir) {
  let srcStaticDir = path.join(srcDir, 'static');
  if (fs.existsSync(srcStaticDir)) {
    overlayStaticDir(srcStaticDir, staticDir);
  }
}

// overlay staticDir -> packageDir/static/*
overlayStaticDir(path.join(packageDir, 'static'), staticDir);

// helper function to symlink files in targetDir into staticDir
function overlayStaticDir(targetDir, staticDir, excludeList = []) {
  if (fs.existsSync(targetDir)) {
    fs.readdirSync(targetDir)
      .filter((file) => !(file.startsWith('.') || excludeList.includes(file)))
      .forEach((file) => {
        try {
          // don't overwrite existing files
          fs.symlinkSync(path.join(targetDir, file), path.join(staticDir, file));
        } catch (e) {
          if (e.code !== 'EEXIST') {
            throw e;
          }
        }
      });
  }
}

// https://kit.svelte.dev/docs/adapter-static#options-pages
// defaults to projectDir/build
// override with GITKITJS_BUILD_DIR, resolved relative to projectDir
let buildDir = path.resolve(projectDir, process.env.GITKITJS_BUILD_DIR ?? 'build');

// All directory paths should be fully resolved
let env = {
  GITKITJS_PROJECT_DIR: projectDir,
  GITKITJS_CONTENT_DIR: contentDir,
  GITKITJS_BUILD_DIR: buildDir,
  GITKITJS_SRC_DIR: srcDir,
  GITKITJS_APPCONFIG_DIR: configDir,
  GITKITJS_STATIC_DIR: staticDir,
  GITKITJS_PACKAGE_DIR: packageDir,
};

// Pass PUBLIC_* env vars for access via import from '$env/static/public'
// process.env vars take precedence over .env file
if (srcDir) {
  let userEnvFile = path.join(srcDir, '.env');
  if (fs.existsSync(userEnvFile)) {
    fs.readFileSync(userEnvFile, { encoding: 'utf8' })
      .split('\n')
      .forEach((line) => {
        let m = line.match(/^(PUBLIC_\w+)=(.*)$/);
        if (m) {
          env[m[1]] = process.env[m[1]] || m[2];
        }
      });
  }
}

// console.log(pkg.name, pkg.version, env);

try {
  child_process.execFileSync(viteFile, [viteCommand], {
    cwd: packageDir,
    stdio: 'inherit',
    env: {
      ...process.env,
      ...env,
    },
  });
} finally {
  fs.rmSync(staticDir, { recursive: true });
}
