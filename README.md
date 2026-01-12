# WXT + Angular Starter

A browser extension starter template using [WXT](https://wxt.dev/) and [Angular](https://angular.dev/).

## Features

- **Angular 21** with zoneless change detection
- **Tailwind CSS v4** for styling
- **WXT** for cross-browser extension development
- **Vite 7** powered build system
- TypeScript with strict mode

## Quick Start

```bash
# Clone the repository
git clone https://github.com/user/wxt-angular-starter.git
cd wxt-angular-starter

# Install dependencies
pnpm install

# Start development server (Chrome)
pnpm dev

# Start development server (Firefox)
pnpm dev:firefox
```

## Available Scripts

| Script | Description |
|--------|-------------|
| `pnpm dev` | Start dev server for Chrome |
| `pnpm dev:firefox` | Start dev server for Firefox |
| `pnpm build` | Build for Chrome |
| `pnpm build:firefox` | Build for Firefox |
| `pnpm zip` | Build and package for Chrome |
| `pnpm zip:firefox` | Build and package for Firefox |
| `pnpm compile` | Type-check without emitting |

## Project Structure

```
├── entrypoints/
│   ├── popup/          # Angular popup entrypoint
│   │   ├── index.html
│   │   ├── main.ts     # Angular bootstrap
│   │   ├── app.ts      # Root component
│   │   └── style.css   # Tailwind entry
│   ├── background.ts   # Service worker
│   └── content.ts      # Content script
├── public/             # Static assets
├── wxt.config.ts       # WXT configuration
├── tsconfig.json       # Base TypeScript config
└── tsconfig.app.json   # Angular-specific config
```

## Adding Angular to Other Entrypoints

To use Angular in additional entrypoints (e.g., options page), update the `transformFilter` in `wxt.config.ts`:

```ts
transformFilter: (_code: string, id: string) => {
  return id.includes('/entrypoints/popup/') || id.includes('/entrypoints/options/');
},
```

And include the new path in `tsconfig.app.json`:

```json
{
  "include": ["entrypoints/popup/**/*.ts", "entrypoints/options/**/*.ts"]
}
```

---

## How to Build This From Scratch

This section explains how to create a WXT + Angular project from scratch.

### 1. Initialize WXT Project

```bash
pnpm dlx wxt@latest init my-extension
cd my-extension
```

### 2. Install Dependencies

```bash
# Angular core packages
pnpm add @angular/core @angular/common @angular/compiler @angular/platform-browser rxjs

# Build tooling
pnpm add -D @analogjs/vite-plugin-angular @angular/build @angular/compiler-cli

# Tailwind CSS (optional)
pnpm add -D tailwindcss @tailwindcss/vite
```

### 3. Override Vite Version

`@analogjs/vite-plugin-angular` requires Vite 7.x. Add to `package.json`:

```json
{
  "pnpm": {
    "overrides": {
      "vite": "^7.3.0"
    }
  }
}
```

Then run `pnpm install` to apply the override.

### 4. Configure WXT

Update `wxt.config.ts`:

```ts
import { defineConfig } from 'wxt';
import angular from '@analogjs/vite-plugin-angular';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  vite: () => ({
    resolve: {
      mainFields: ['module'], // Prioritize ESM
    },
    plugins: [
      angular({
        tsconfig: 'tsconfig.app.json',
        // Limit Angular compilation to specific entrypoints
        transformFilter: (_code: string, id: string) => {
          return id.includes('/entrypoints/popup/');
        },
      }),
      tailwindcss(),
    ],
  }),
});
```

### 5. Configure TypeScript

**tsconfig.json** (project-wide):

```json
{
  "extends": "./.wxt/tsconfig.json",
  "compilerOptions": {
    "experimentalDecorators": true,
    "useDefineForClassFields": false
  },
  "angularCompilerOptions": {
    "strictInjectionParameters": true,
    "strictInputAccessModifiers": true,
    "strictTemplates": true
  }
}
```

**tsconfig.app.json** (Angular-specific):

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ES2022",
    "moduleResolution": "bundler",
    "lib": ["ES2022", "DOM"],
    "strict": true,
    "experimentalDecorators": true,
    "useDefineForClassFields": false,
    "skipLibCheck": true,
    "isolatedModules": true
  },
  "angularCompilerOptions": {
    "strictInjectionParameters": true,
    "strictInputAccessModifiers": true,
    "strictTemplates": true
  },
  "include": ["entrypoints/popup/**/*.ts"]
}
```

### 6. Create Angular Popup Entrypoint

**entrypoints/popup/index.html**:

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>My Extension</title>
    <meta name="manifest.type" content="browser_action" />
  </head>
  <body>
    <app-root></app-root>
    <script type="module" src="./main.ts"></script>
  </body>
</html>
```

**entrypoints/popup/main.ts**:

```ts
import './style.css';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideZonelessChangeDetection } from '@angular/core';
import { App } from './app';

bootstrapApplication(App, {
  providers: [provideZonelessChangeDetection()],
}).catch((err: unknown) => console.error(err));
```

**entrypoints/popup/app.ts**:

```ts
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block p-4' },
  template: `
    <h1 class="text-lg font-bold">Hello from Angular!</h1>
  `,
})
export class App {}
```

**entrypoints/popup/style.css**:

```css
@import 'tailwindcss';
```

### Key Concepts

- **Zoneless Angular**: Uses `provideZonelessChangeDetection()` for better performance in extension context
- **Selective Compilation**: `transformFilter` limits Angular processing to specific entrypoints, allowing plain TypeScript elsewhere
- **ESM Priority**: `mainFields: ['module']` ensures ESM modules are preferred

## License

MIT
