#!/usr/bin/env node

import { Command } from 'commander';
import { handleListCommand } from './commands/list';
import { version, description } from '../package.json';

const program = new Command();

program
  .name('henv')
  .description(description)
  .version(version);

program
  .command('list')
  .description('List environment variables for the current project or discover projects')
  .option('-d, --dir <directory>', 'Target directory to scan (defaults to current directory)')
  .option('--depth <number>', 'Maximum depth to search for environment files (default: 7)', '7')
  .action(async (options) => {
    const depth = parseInt(options.depth, 10);
    if (isNaN(depth) || depth < 1) {
      console.error('Error: Depth must be a positive number');
      process.exit(1);
    }
    await handleListCommand(options.dir, depth);
  });

// Default command (when no command is specified, run list)
program
  .action(async () => {
    // TODO: Add help command
  });

// Parse command line arguments
program.parse(); 