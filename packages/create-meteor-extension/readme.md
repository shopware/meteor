# @shopware-ag/create-meteor-extension

A CLI tool for scaffolding new Meteor Admin SDK extensions for Shopware 6. This tool generates a complete project setup with Vue 3, TypeScript, and Vite, allowing you to quickly start building custom extensions for the Shopware Administration.

## What is Meteor?

Meteor is Shopware's Admin SDK that enables developers to extend the Shopware Administration with custom UI components and functionality without modifying the core. Extensions built with Meteor run in isolated iframes and communicate with the Shopware Administration through a secure messaging system.

## Features

- **Modern Stack**: Vue 3, TypeScript, and Vite for fast development and optimal performance
- **Ready-to-use Template**: Includes example locations (dashboard card and product tab) to get started
- **Pre-configured Development Environment**: ESLint, Prettier, and TypeScript configuration out of the box
- **Hot Module Replacement**: Vite development server with instant updates
- **Internationalization**: Built-in i18n support with example translations (German and English)
- **Component Library**: Integrates `@shopware-ag/meteor-component-library` for consistent UI

## Usage

You can run the CLI directly using npx (recommended) or install it globally:

```bash
# Using npx (recommended - always uses latest version)
npx @shopware-ag/create-meteor-extension

# Or install globally
npm install -g @shopware-ag/create-meteor-extension
create-meteor-extension
```

The CLI will interactively prompt you for:
- **Extension name**: Must contain only lowercase letters, numbers, and hyphens (e.g., `my-awesome-extension`)

**Note**: The CLI will always create a folder named `meteor-app` (as required by Shopware 6.7+ plugin structure), but the extension name you provide will be used in `package.json`, README, and other configuration files.

## What Gets Created

The CLI generates a complete project structure in a folder named `meteor-app`:

```
meteor-app/
├── src/
│   ├── locations/           # Vue components for different admin locations
│   │   ├── exampleDashboard.vue
│   │   └── exampleProductTab.vue
│   ├── assets/              # Styles and static assets
│   ├── app.ts               # Application entry point
│   ├── bootstrap.ts         # SDK initialization
│   ├── locations.ts         # Location configuration
│   └── main.ts              # Main entry point
├── snippet/                 # Translation files
│   ├── de-DE.json
│   └── en-GB.json
├── public/                  # Static assets
├── package.json             # Dependencies and scripts
├── vite.config.ts           # Vite configuration
├── tsconfig.json            # TypeScript configuration
└── eslint.config.ts         # ESLint configuration
```

For Shopware 6.7+ plugins, this should be placed in `custom/plugins/yourPlugin/src/Resources/app/meteor-app`.

### Key Dependencies

- **@shopware-ag/meteor-admin-sdk**: Core SDK for Shopware Admin extensions
- **@shopware-ag/meteor-component-library**: UI component library matching Shopware's design system
- **Vue 3**: Progressive JavaScript framework
- **Vue Router**: Client-side routing
- **Vite**: Next-generation frontend tooling

## Getting Started

After creating your extension:

1. Navigate to the generated directory:
```bash
cd meteor-app
```

2. Install dependencies:
```bash
npm install
# or
pnpm install
```

3. Start the development server:
```bash
npm run dev
```

4. The Vite dev server will start at `http://localhost:5173`. You'll need to configure your Shopware plugin to load this URL.

### Development Workflow

1. **Development Server**: Run `npm run dev` to start the Vite development server with hot module replacement
2. **Type Checking**: Run `npm run type-check` to validate TypeScript types
3. **Linting**: Run `npm run lint` to check and fix code style issues
4. **Building**: Run `npm run build` to create a production build in the `dist/` directory
5. **Preview**: Run `npm run preview` to preview the production build locally

### Available Scripts

- `npm run dev` - Start development server with HMR
- `npm run build` - Build for production (runs type-check and build-only)
- `npm run build-only` - Build without type checking
- `npm run type-check` - Run TypeScript compiler check
- `npm run lint` - Lint and fix code with ESLint
- `npm run format` - Format code with Prettier
- `npm run preview` - Preview production build locally

## Extension Locations

The generated template includes two example locations:

1. **Dashboard Card** (`example-dashboard-before-content`): Appears on the Shopware dashboard
2. **Product Tab** (`example-product-tab`): Adds a custom tab to product detail pages

You can easily add more locations by:
1. Creating a new Vue component in `src/locations/`
2. Registering it in `src/locations.ts`
3. Configuring the location in `src/bootstrap.ts`

## Requirements

- Node.js 18+
- npm or pnpm
- Shopware 6 instance for testing your extension

## CLI Development

To work on the CLI itself:

```bash
# Run locally without building
./packages/create-meteor-extension/bin/create-meteor-extension [arguments]

# Build the CLI
npm run build

# Run tests
npm test
```

The CLI automatically detects development mode and runs TypeScript files directly using `ts-node`, so no build step is required during development.

## Technical Details

This CLI is built with [Gluegun](https://github.com/infinitered/gluegun), a toolkit for building command-line apps. It uses EJS templates to generate customized project files based on your input.

## License

MIT - see LICENSE
