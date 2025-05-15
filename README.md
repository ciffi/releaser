# @ciffi-js/releaser

Node based release version manager and code quality utilities

## Features

- ✅ Automatic version management
- ✅ Automatic changelog generation
- ✅ Husky configuration for git hooks
- ✅ ESLint configuration optimized for Next.js
- ✅ Prettier configuration
- ✅ TypeScript configuration
- ✅ Support for lint-staged

## Installation

- npm: `npm i -D @ciffi-js/releaser`

- yarn: `yarn add --dev @ciffi-js/releaser`

## Functionality

### Configuration Files

During installation, the package automatically adds the following configuration files:

- `.editorconfig` - Editor configuration
- `.prettierignore` - Files to ignore for Prettier
- `.prettierrc.js` - Prettier configuration
- `eslint.config.mjs` - ESLint configuration (compatible with Next.js)
- `tsconfig.json` - TypeScript configuration

### Husky Configuration

The package automatically configures Husky with the following hooks:

- `commit-msg` - Verifies that commit messages follow the [Conventional Commits](https://www.conventionalcommits.org/) convention
- `pre-commit` - Runs lint-staged to check and format modified files

### Scripts Added to package.json

- `lint` - Runs Prettier, TypeScript, and ESLint
- `version` - Generates the changelog and adds it to the commit
- `push-tags` - Pushes tags and changes

## Usage

### Generate a New Release

- npm: `npm run version patch|minor|major`

- yarn: `yarn version`

### Push Release, Changelog, and Tags

- npm: `npm run push-tags`

- yarn: `yarn push-tags`

or manually:

- `git push --follow-tags`

## Compatibility

- ✅ Compatible with Next.js
- ✅ Support for ESM and CommonJS
- ✅ Support for TypeScript