import * as fs from 'fs';
import * as path from 'path';
import { CONFIG } from '../config/constants';

export interface EnvVariable {
  key: string;
  value: string;
}

export interface EnvFile {
  fileName: string;
  environment: string;
  path: string;
  variables: EnvVariable[];
}

/**
 * Parse environment variables from a .env file content
 */
export function parseEnvFile(content: string): EnvVariable[] {
  const variables: EnvVariable[] = [];
  const lines = content.split('\n');
  
  for (const line of lines) {
    const trimmedLine = line.trim();
    
    // Skip empty lines and comments
    if (!trimmedLine || trimmedLine.startsWith('#')) {
      continue;
    }
    
    // Look for KEY=VALUE pattern
    const match = trimmedLine.match(/^([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/);
    if (match) {
      const [, key, value] = match;
      // Remove surrounding quotes if present
      const cleanValue = value.replace(/^["']|["']$/g, '');
      variables.push({ key, value: cleanValue });
    }
  }
  
  return variables;
}

/**
 * Extract environment name from file name
 */
export function extractEnvironment(fileName: string): string {
  if (fileName === '.env') {
    return 'default';
  }
  
  // Remove .env prefix and return the rest
  const envPart = fileName.replace(/^\.env\.?/, '');
  return envPart || 'default';
}

/**
 * Check if a directory should be skipped during search
 */
function shouldSkipDirectory(dirName: string): boolean {
  return dirName.startsWith('.') || CONFIG.skipDirectories.includes(dirName as any);
}

/**
 * Recursively discover all environment files in a directory and its subdirectories
 */
export function discoverEnvFiles(dirPath: string, maxDepth: number = CONFIG.searchDepth, currentDepth: number = 0): EnvFile[] {
  const envFiles: EnvFile[] = [];
  
  // Stop if we've reached max depth
  if (currentDepth >= maxDepth) {
    return envFiles;
  }
  
  try {
    const entries = fs.readdirSync(dirPath, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dirPath, entry.name);
      
      if (entry.isFile() && CONFIG.envFilePattern.test(entry.name)) {
        try {
          const content = fs.readFileSync(fullPath, 'utf8');
          const variables = parseEnvFile(content);
          
          // Calculate relative path for display
          const relativePath = currentDepth > 0 ? path.relative(path.dirname(path.dirname(fullPath)), fullPath) : fullPath;
          
          envFiles.push({
            fileName: entry.name,
            environment: extractEnvironment(entry.name),
            path: fullPath,
            variables,
          });
        } catch (error) {
          // Skip files that can't be read
          console.warn(`Warning: Could not read ${entry.name} at ${fullPath}`);
        }
      } else if (entry.isDirectory() && !shouldSkipDirectory(entry.name)) {
        // Recursively search subdirectories
        const subDirFiles = discoverEnvFiles(fullPath, maxDepth, currentDepth + 1);
        envFiles.push(...subDirFiles);
      }
    }
  } catch (error) {
    // Directory doesn't exist or no permission
  }
  
  return envFiles.sort((a, b) => {
    // Sort with 'default' (.env) first, then alphabetically
    if (a.environment === 'default') return -1;
    if (b.environment === 'default') return 1;
    return a.environment.localeCompare(b.environment);
  });
}

/**
 * Get environment files for a project
 */
export function getProjectEnvFiles(projectPath: string, maxDepth?: number): EnvFile[] {
  return discoverEnvFiles(projectPath, maxDepth);
} 