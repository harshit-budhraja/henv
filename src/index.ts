#!/usr/bin/env node

import { Command } from 'commander';
import { handleListCommand } from './commands/list';
import { handleSearchCommand } from './commands/search';
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
  .option('-s, --depth <number>', 'Maximum depth to search for environment files', '7')
  .option('-m, --mask-env-variables', 'Mask environment variables', false)
  .action(async (options) => {
    const depth = parseInt(options.depth, 10);
    if (isNaN(depth) || depth < 1) {
      console.error('Error: Depth must be a positive number');
      process.exit(1);
    }
    await handleListCommand(options.dir, depth, options.maskEnvVariables);
  });

program
  .command('search <term>')
  .description('Search for environment variables by name across projects')
  .option('-d, --dir <directory>', 'Target directory to scan (defaults to current directory)')
  .option('-s, --depth <number>', 'Maximum depth to search for environment files', '7')
  .option('-p, --pattern', 'Use regex pattern matching instead of text search', false)
  .option('-c, --case-sensitive', 'Make search case sensitive', false)
  .option('-m, --mask-env-variables', 'Mask environment variables', false)
  .action(async (term, options) => {
    const depth = parseInt(options.depth, 10);
    if (isNaN(depth) || depth < 1) {
      console.error('Error: Depth must be a positive number');
      process.exit(1);
    }
    await handleSearchCommand(
      term,
      options.dir,
      options.pattern,
      options.caseSensitive,
      depth,
      options.maskEnvVariables
    );
  });

// Default command (when no command is specified, run list)
program
  .action(async () => {
    // TODO: Add help command
  });

// Parse command line arguments
program.parse(); 