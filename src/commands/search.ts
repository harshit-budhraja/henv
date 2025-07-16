import * as path from 'path';
import { isGitRepository, getGitRoot, findGitProjects } from '../utils/git';
import { getProjectEnvFiles, EnvFile, EnvVariable } from '../utils/env';
import {
  displayWelcome,
  displayError,
  displayInfo,
  displaySuccess,
} from '../cli/interface';
import chalk from 'chalk';

export interface SearchResult {
  projectName: string;
  projectPath: string;
  envFile: EnvFile;
  variable: EnvVariable;
  matchType: 'exact' | 'partial' | 'pattern';
}

/**
 * Search for environment variables by name
 */
function searchVariables(
  envFiles: EnvFile[],
  searchTerm: string,
  isPattern: boolean,
  caseSensitive: boolean
): { variable: EnvVariable; envFile: EnvFile; matchType: 'exact' | 'partial' | 'pattern' }[] {
  const results: { variable: EnvVariable; envFile: EnvFile; matchType: 'exact' | 'partial' | 'pattern' }[] = [];
  
  for (const envFile of envFiles) {
    for (const variable of envFile.variables) {
      const key = caseSensitive ? variable.key : variable.key.toLowerCase();
      const term = caseSensitive ? searchTerm : searchTerm.toLowerCase();
      
      let isMatch = false;
      let matchType: 'exact' | 'partial' | 'pattern' = 'partial';
      
      if (isPattern) {
        try {
          const regex = new RegExp(searchTerm, caseSensitive ? 'g' : 'gi');
          isMatch = regex.test(variable.key);
          matchType = 'pattern';
        } catch (error) {
          // Invalid regex pattern
          continue;
        }
      } else {
        if (key === term) {
          isMatch = true;
          matchType = 'exact';
        } else if (key.includes(term)) {
          isMatch = true;
          matchType = 'partial';
        }
      }
      
      if (isMatch) {
        results.push({ variable, envFile, matchType });
      }
    }
  }
  
  return results;
}

/**
 * Display search results
 */
function displaySearchResults(
  results: SearchResult[],
  searchTerm: string,
  isPattern: boolean,
  maskEnvVariables: boolean = false
): void {
  if (results.length === 0) {
    const searchType = isPattern ? 'pattern' : 'text';
    displayError(`No environment variables found matching ${searchType}: "${searchTerm}"`);
    console.log('\n💡 Tip: Try a different search term or use pattern matching with --pattern');
    return;
  }

  console.log(chalk.green.bold(`\n🔍 Found ${results.length} result(s) for "${searchTerm}":\n`));

  // Group results by project
  const resultsByProject = results.reduce((acc, result) => {
    if (!acc[result.projectName]) {
      acc[result.projectName] = [];
    }
    acc[result.projectName].push(result);
    return acc;
  }, {} as Record<string, SearchResult[]>);

  for (const [projectName, projectResults] of Object.entries(resultsByProject)) {
    console.log(chalk.cyan.bold(`📁 Project: ${projectName}`));
    console.log(chalk.gray(`   Path: ${projectResults[0].projectPath}\n`));

    // Group by environment file
    const resultsByFile = projectResults.reduce((acc, result) => {
      const fileKey = result.envFile.fileName;
      if (!acc[fileKey]) {
        acc[fileKey] = [];
      }
      acc[fileKey].push(result);
      return acc;
    }, {} as Record<string, SearchResult[]>);

    for (const [fileName, fileResults] of Object.entries(resultsByFile)) {
      const envFile = fileResults[0].envFile;
      console.log(`  📄 ${chalk.yellow(fileName)} ${chalk.gray(`(${envFile.environment})`)}`);
      
      for (const result of fileResults) {
        const { variable, matchType } = result;
        const matchIcon = matchType === 'exact' ? '🎯' : matchType === 'pattern' ? '🔍' : '📝';
        const matchLabel = matchType === 'exact' ? 'exact' : matchType === 'pattern' ? 'pattern' : 'partial';
        
        let displayValue = variable.value;
        if (maskEnvVariables && variable.value.length > 20) {
          displayValue = variable.value.substring(0, 10) + '...' + variable.value.substring(variable.value.length - 5);
        }
        
        console.log(`    ${matchIcon} ${chalk.green(variable.key)} = ${chalk.dim(displayValue)} ${chalk.gray(`(${matchLabel})`)}`);
      }
      console.log('');
    }
  }
}

/**
 * Search in a single project
 */
async function searchInSingleProject(
  projectPath: string,
  searchTerm: string,
  isPattern: boolean,
  caseSensitive: boolean,
  maxDepth?: number,
  maskEnvVariables?: boolean
): Promise<void> {
  const gitRoot = getGitRoot(projectPath);
  const projectDir = gitRoot || projectPath;
  const projectName = path.basename(projectDir);

  displayInfo(`Searching in git project: ${projectName}`);

  const envFiles = getProjectEnvFiles(projectDir, maxDepth);
  
  if (envFiles.length === 0) {
    displayError('No environment files found in this project.');
    return;
  }

  const searchResults = searchVariables(envFiles, searchTerm, isPattern, caseSensitive);
  const results: SearchResult[] = searchResults.map(result => ({
    projectName,
    projectPath: projectDir,
    envFile: result.envFile,
    variable: result.variable,
    matchType: result.matchType,
  }));

  displaySearchResults(results, searchTerm, isPattern, maskEnvVariables);
}

/**
 * Search in multiple projects
 */
async function searchInMultipleProjects(
  baseDir: string,
  searchTerm: string,
  isPattern: boolean,
  caseSensitive: boolean,
  maxDepth?: number,
  maskEnvVariables?: boolean
): Promise<void> {
  displayInfo('Scanning for git projects...');

  const projects = findGitProjects(baseDir);

  if (projects.length === 0) {
    displayError('No git projects found in this directory.');
    console.log('\n💡 Tip: Navigate to a git repository or a directory containing git repositories.');
    return;
  }

  const allResults: SearchResult[] = [];

  for (const project of projects) {
    const envFiles = getProjectEnvFiles(project.path, maxDepth);
    
    if (envFiles.length > 0) {
      const searchResults = searchVariables(envFiles, searchTerm, isPattern, caseSensitive);
      const projectResults: SearchResult[] = searchResults.map(result => ({
        projectName: project.name,
        projectPath: project.path,
        envFile: result.envFile,
        variable: result.variable,
        matchType: result.matchType,
      }));
      
      allResults.push(...projectResults);
    }
  }

  displaySearchResults(allResults, searchTerm, isPattern, maskEnvVariables);
}

/**
 * Handle the search command
 */
export async function handleSearchCommand(
  searchTerm: string,
  targetDir: string = process.cwd(),
  isPattern: boolean = false,
  caseSensitive: boolean = false,
  maxDepth?: number,
  maskEnvVariables?: boolean
): Promise<void> {
  displayWelcome();

  if (!searchTerm || searchTerm.trim() === '') {
    displayError('Search term is required.');
    console.log('\n💡 Usage: henv search <term> [options]');
    process.exit(1);
  }

  try {
    // Check if current directory is a git repository
    if (isGitRepository(targetDir)) {
      await searchInSingleProject(targetDir, searchTerm, isPattern, caseSensitive, maxDepth, maskEnvVariables);
    } else {
      await searchInMultipleProjects(targetDir, searchTerm, isPattern, caseSensitive, maxDepth, maskEnvVariables);
    }
  } catch (error) {
    displayError(`An unexpected error occurred: ${error instanceof Error ? error.message : 'Unknown error'}`);
    process.exit(1);
  }
} 