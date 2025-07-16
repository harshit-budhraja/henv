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
  .action(async (options) => {
    await handleListCommand(options.dir);
  });

// Default command (when no command is specified, run list)
program
  .action(async () => {
    // TODO: Add help command
  });

// Parse command line arguments
program.parse(); 