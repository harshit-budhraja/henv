# HENV - Environment Variable Manager

Interactive CLI tool for managing local environment variables across your projects.

## Features

- 🔍 **Discoverability**: Automatically discover environment files across your projects
- 📁 **Project-aware**: Works with git repositories to logically group environments
- 🌱 **Multi-environment**: Supports various .env file patterns (.env, .env.development, .env.production, etc.)
- 🎯 **Interactive**: Beautiful CLI interface with project selection
- 🔒 **Secure**: Masks sensitive values by default

---

## 🆘 Help & Usage

You can always run `henv help` for a comprehensive overview:

```
Usage: henv <command> [options]

Commands:
  list [options]           List environment variables for the current project or discover projects
  search <term> [options]  Search for environment variables by name across projects
  help                     Show this help message

Options for "list":
  -d, --dir <directory>         Target directory to scan (defaults to current directory)
  -s, --depth <number>          Maximum depth to search for environment files (default: 7)
  -m, --mask-env-variables      Mask environment variable values

Options for "search":
  -d, --dir <directory>         Target directory to scan (defaults to current directory)
  -s, --depth <number>          Maximum depth to search for environment files (default: 7)
  -p, --pattern                 Use regex pattern matching instead of text search
  -c, --case-sensitive          Make search case sensitive
  -m, --mask-env-variables      Mask environment variable values

Examples:
  henv list
  henv list --dir ./apps --depth 5
  henv search API_KEY
  henv search "^LOG_" --pattern
  henv search api --case-sensitive
  henv search SECRET --mask-env-variables
  henv search PORT --depth 3
  henv search DATABASE --dir /path/to/projects
```

---

## Installation

```bash
npm install
npm run build
```

## Usage

### Development Workflow (with live code changes)

```bash
# Start development mode - creates temporary 'henv-dev' executable
npm run dev

# In another terminal, use the global executable anywhere:
henv-dev list
henv-dev search API_KEY
henv-dev list --dir /path/to/projects

# Press Ctrl+C in the dev terminal to exit and cleanup
```

### Production Workflow (built executable)

```bash
# Build and install global 'henv' executable
npm run build

# Use the global executable anywhere:
henv list
henv search DATABASE_URL
henv list --dir /path/to/projects

# Uninstall when done
npm run uninstall-bin
```

### Local Development (traditional)

```bash
npm run start list
npm run start list --dir /path/to/projects
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

Then explore your environment variables:

```bash
# List all environment files and variables
npm run dev list

# Search for specific variables
npm run dev search API_KEY
npm run dev search DATABASE --pattern
npm run dev search "^LOG_" --pattern

# Search with options
npm run dev search api --case-sensitive
npm run dev search "URL$" --pattern --mask-env-variables
```

## Available Scripts

### Main Commands
- `npm run dev` - Start development mode with temporary global executable and live code changes
- `npm run build` - Build TypeScript and install production executable to system bin
- `npm run start` - Run the built version locally (traditional way)

### CLI Commands
- `henv list` - List all environment variables in current context
- `henv search <term>` - Search for environment variables by name
  - `--pattern` - Use regex pattern matching
  - `--case-sensitive` - Case sensitive search
  - `--depth <n>` - Search depth (default: 7)
  - `--mask-env-variables` - Mask variable values

### Utility Commands
- `npm run dev-bin` - Internal: Start development bin manager
- `npm run install-bin` - Install built executable to system bin
- `npm run uninstall-bin` - Remove executables from system bin

## Development

```bash
# Install dependencies
npm install

# Development workflow (recommended)
npm run dev  # Creates henv-dev executable with live reloading

# Production workflow
npm run build  # Creates henv executable

# Traditional local development
npm run start list
``` 