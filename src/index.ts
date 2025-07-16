#!/usr/bin/env node

import { Command } from 'commander';
import { handleListCommand } from './commands/list';

const program = new Command();

program
  .name('henv')
  .description('Interactive CLI tool for managing local environment variables')
  .version('1.0.0');

program
  .command('list')
  .description('List environment variables for the current project or discover projects')
  .option('-d, --dir <directory>', 'Target directory to scan (defaults to current directory)')
  .action(async (options) => {
    await handleListCommand(options.dir);
  });

// Default command (when no command is specified, run list)
program
  .action(async () => {
    await handleListCommand();
  });

// Parse command line arguments
program.parse(); 