/**
 * Configuration constants for henv
 */

export const DEFAULT_SEARCH_DEPTH = 7;

export const CONFIG = {
  /**
   * Maximum depth to search for environment files within a project
   */
  searchDepth: DEFAULT_SEARCH_DEPTH,
  
  /**
   * Directories to skip during recursive search
   */
  skipDirectories: [
    'node_modules',
    '.git',
    '.next',
    'dist',
    'build',
    'coverage',
    '.nyc_output',
    'logs',
    '.cache',
    'vendor',
    'target',
    'bin'
  ] as const,
  
  /**
   * Environment file pattern
   */
  envFilePattern: /^\.env(\.\w+)?$/,
} as const; 