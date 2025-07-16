import * as path from 'path';
import { isGitRepository, getGitRoot, findGitProjects } from '../utils/git';
import { getProjectEnvFiles } from '../utils/env';
import {
  displayWelcome,
  displayError,
  displayInfo,
  selectProject,
  displayProjectEnvFiles,
} from '../cli/interface';

/**
 * Handle the list command
 */
export async function handleListCommand(targetDir: string = process.cwd(), maxDepth?: number, maskEnvVariables?: boolean): Promise<void> {
  displayWelcome();

  try {
    // Check if current directory is a git repository
    if (isGitRepository(targetDir)) {
      await handleSingleProject(targetDir, maxDepth, maskEnvVariables);
    } else {
      await handleMultipleProjects(targetDir, maxDepth, maskEnvVariables);
    }
  } catch (error) {
    displayError(`An unexpected error occurred: ${error instanceof Error ? error.message : 'Unknown error'}`);
    process.exit(1);
  }
}

/**
 * Handle the case where we're in a single git project
 */
async function handleSingleProject(projectPath: string, maxDepth?: number, maskEnvVariables?: boolean): Promise<void> {
  const gitRoot = getGitRoot(projectPath);
  const projectDir = gitRoot || projectPath;
  const projectName = path.basename(projectDir);

  displayInfo(`Found git project: ${projectName}`);

  const envFiles = getProjectEnvFiles(projectDir, maxDepth);
  displayProjectEnvFiles(projectName, envFiles, maskEnvVariables);

  if (envFiles.length === 0) {
    console.log('\n💡 Tip: Create environment files like .env, .env.development, .env.production to get started!');
  }
}

/**
 * Handle the case where we need to discover multiple projects
 */
async function handleMultipleProjects(baseDir: string, maxDepth?: number, maskEnvVariables?: boolean): Promise<void> {
  displayInfo('Scanning for git projects...');

  const projects = findGitProjects(baseDir);

  if (projects.length === 0) {
    displayError('No git projects found in this directory.');
    console.log('\n💡 Tip: Navigate to a git repository or a directory containing git repositories.');
    return;
  }

  // Filter projects that have environment files
  const projectsWithEnv = projects.filter(project => {
    const envFiles = getProjectEnvFiles(project.path, maxDepth);
    return envFiles.length > 0;
  });

  if (projectsWithEnv.length === 0) {
    displayInfo(`Found ${projects.length} git project(s), but none have environment files.`);
    console.log('\n💡 Tip: Add .env files to your projects to manage environment variables.');
    
    // Still show the projects for reference
    console.log('\nProjects found:');
    projects.forEach(project => {
      console.log(`  📁 ${project.name} (${project.path})`);
    });
    return;
  }

  displayInfo(`Found ${projectsWithEnv.length} project(s) with environment files:`);

  // Show summary of projects with env files
  console.log('');
  projectsWithEnv.forEach(project => {
    const envFiles = getProjectEnvFiles(project.path, maxDepth);
    console.log(`📁 ${project.name} - ${envFiles.length} environment file(s)`);
  });

  // Allow user to select a project for detailed view
  const selectedProject = await selectProject(projectsWithEnv);

  if (selectedProject) {
    const envFiles = getProjectEnvFiles(selectedProject.path, maxDepth);
    displayProjectEnvFiles(selectedProject.name, envFiles, maskEnvVariables);
  } else {
    displayInfo('Goodbye! 👋');
  }
} 