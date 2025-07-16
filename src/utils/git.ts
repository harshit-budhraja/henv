import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

export interface GitProject {
  name: string;
  path: string;
}

/**
 * Check if a directory is a git repository
 */
export function isGitRepository(dirPath: string): boolean {
  try {
    const gitDir = path.join(dirPath, '.git');
    return fs.existsSync(gitDir);
  } catch {
    return false;
  }
}

/**
 * Get the root directory of a git repository
 */
export function getGitRoot(dirPath: string): string | null {
  try {
    const result = execSync('git rev-parse --show-toplevel', {
      cwd: dirPath,
      encoding: 'utf8',
    });
    return result.trim();
  } catch {
    return null;
  }
}

/**
 * Find all git projects in a directory (non-recursive for immediate subdirectories)
 */
export function findGitProjects(dirPath: string): GitProject[] {
  const projects: GitProject[] = [];
  
  try {
    const entries = fs.readdirSync(dirPath, { withFileTypes: true });
    
    for (const entry of entries) {
      if (entry.isDirectory() && !entry.name.startsWith('.')) {
        const fullPath = path.join(dirPath, entry.name);
        
        if (isGitRepository(fullPath)) {
          projects.push({
            name: entry.name,
            path: fullPath,
          });
        }
      }
    }
  } catch (error) {
    // Directory doesn't exist or no permission
  }
  
  return projects;
} 