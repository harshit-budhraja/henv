import inquirer from 'inquirer';
import chalk from 'chalk';
import { GitProject } from '../utils/git';
import { EnvFile, EnvVariable } from '../utils/env';

/**
 * Display a welcome message
 */
export function displayWelcome(): void {
  // console.log(chalk.cyan.bold('\n🌱 HENV - Environment Variable Manager\n'));
}

/**
 * Display error message
 */
export function displayError(message: string): void {
  console.log(chalk.red.bold('❌ Error: ') + chalk.red(message));
}

/**
 * Display success message
 */
export function displaySuccess(message: string): void {
  console.log(chalk.green.bold('✅ ') + chalk.green(message));
}

/**
 * Display info message
 */
export function displayInfo(message: string): void {
  console.log(chalk.blue.bold('ℹ️  ') + chalk.blue(message));
}

/**
 * Prompt user to select a project from available git projects
 */
export async function selectProject(projects: GitProject[]): Promise<GitProject | null> {
  if (projects.length === 0) {
    displayError('No git projects found in this directory.');
    return null;
  }

  console.log(chalk.yellow.bold('\n📁 Multiple projects found:\n'));

  const choices: Array<{name: string; value: GitProject | null}> = projects.map(project => ({
    name: `${chalk.cyan(project.name)} ${chalk.gray(`(${project.path})`)}`,
    value: project,
  }));

  choices.push({
    name: chalk.gray('← Exit'),
    value: null,
  });

  const answer = await inquirer.prompt([
    {
      type: 'list',
      name: 'project',
      message: 'Select a project to view its environment variables:',
      choices,
      pageSize: 10,
    },
  ]);

  return answer.project;
}

/**
 * Display environment files for a project
 */
export function displayProjectEnvFiles(projectName: string, envFiles: EnvFile[], maskEnvVariables?: boolean): void {
  if (envFiles.length === 0) {
    displayInfo(`No environment files found in project "${projectName}".`);
    return;
  }

  console.log(chalk.green.bold(`\n🌱 Environment files for project "${projectName}":\n`));

  for (const envFile of envFiles) {
    console.log(chalk.cyan.bold(`📄 ${envFile.fileName}`));
    console.log(chalk.gray(`   Environment: ${envFile.environment}`));
    console.log(chalk.gray(`   Path: ${envFile.path}`));
    console.log(chalk.gray(`   Variables: ${envFile.variables.length}`));
    
    if (envFile.variables.length > 0) {
      console.log(chalk.yellow('   Variables:'));
      for (const variable of envFile.variables) {
        const maskedValue = maskEnvVariables
          ? variable.value.length > 20 
            ? variable.value.substring(0, 10) + '...' + variable.value.substring(variable.value.length - 5)
            : variable.value
          : variable.value;
        console.log(`     ${chalk.green(variable.key)}=${chalk.dim(maskedValue)}`);
      }
    }
    console.log('');
  }
}

/**
 * Prompt user to select which environment details to view
 */
export async function selectEnvironmentDetails(envFiles: EnvFile[]): Promise<EnvFile | null> {
  if (envFiles.length === 0) {
    return null;
  }

  if (envFiles.length === 1) {
    return envFiles[0];
  }

  const choices: Array<{name: string; value: EnvFile | null}> = envFiles.map(envFile => ({
    name: `${chalk.cyan(envFile.fileName)} ${chalk.gray(`(${envFile.environment}) - ${envFile.variables.length} variables`)}`,
    value: envFile,
  }));

  choices.push({
    name: chalk.gray('← Back'),
    value: null,
  });

  const answer = await inquirer.prompt([
    {
      type: 'list',
      name: 'envFile',
      message: 'Select an environment file to view details:',
      choices,
    },
  ]);

  return answer.envFile;
}

/**
 * Display detailed view of environment variables
 */
export function displayEnvVariables(envFile: EnvFile, showValues: boolean = false): void {
  console.log(chalk.green.bold(`\n📄 ${envFile.fileName} (${envFile.environment})\n`));
  console.log(chalk.gray(`Path: ${envFile.path}`));
  console.log(chalk.gray(`Variables: ${envFile.variables.length}\n`));

  if (envFile.variables.length === 0) {
    displayInfo('No variables found in this file.');
    return;
  }

  console.log(chalk.yellow.bold('Variables:'));
  for (const variable of envFile.variables) {
    const displayValue = showValues 
      ? variable.value 
      : (variable.value.length > 20 
          ? variable.value.substring(0, 10) + '...' + variable.value.substring(variable.value.length - 5)
          : variable.value);
    
    console.log(`  ${chalk.green(variable.key)} = ${chalk.dim(displayValue)}`);
  }
} 