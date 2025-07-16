# HENV - Environment Variable Manager

Interactive CLI tool for managing local environment variables across your projects.

## Features

- 🔍 **Discoverability**: Automatically discover environment files across your projects
- 📁 **Project-aware**: Works with git repositories to logically group environments
- 🌱 **Multi-environment**: Supports various .env file patterns (.env, .env.development, .env.production, etc.)
- 🎯 **Interactive**: Beautiful CLI interface with project selection
- 🔒 **Secure**: Masks sensitive values by default

## Installation

```bash
npm install
npm run build
```

## Usage

### List environments in current project

```bash
npm run dev list
# or after building:
node dist/index.js list
```

### List environments in specific directory

```bash
npm run dev list --dir /path/to/projects
```

## How it works

1. **Single Git Project**: If you run `henv list` from within a git repository, it will show all environment files for that project.

2. **Multiple Projects**: If you run it from a directory containing multiple git projects, it will:
   - Discover all git projects with environment files
   - Show a summary list
   - Allow you to select a project for detailed view

## Supported Environment File Patterns

- `.env` (default environment)
- `.env.development`
- `.env.test`
- `.env.production`
- `.env.prod`
- `.env.staging`
- `.env.local`
- And any other `.env.*` pattern

## Examples

Create some test environment files:

```bash
# Default environment
echo "DATABASE_URL=localhost:5432
API_KEY=secret123
DEBUG=true" > .env

# Development environment
echo "DATABASE_URL=dev.localhost:5432
API_KEY=dev_key_456
DEBUG=true
LOG_LEVEL=debug" > .env.development

# Production environment
echo "DATABASE_URL=prod.database.com:5432
API_KEY=prod_key_789
DEBUG=false
LOG_LEVEL=error" > .env.production
```

Then run:

```bash
npm run dev list
```

## Development

```bash
# Install dependencies
npm install

# Run in development mode
npm run dev

# Build for production
npm run build

# Run built version
npm start
``` 