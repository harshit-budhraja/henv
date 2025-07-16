import chalk from "chalk";
import { description } from "../../package.json";

export async function handleHelpCommand(): Promise<void> {
  console.log(chalk.cyan.bold('🌱 HENV - Environment Variable Manager'));
  console.log(`\n${description}\n`);
  console.log('Usage: henv <command> [options]\n');
  console.log('Commands:');
  console.log('  list [options]           List environment variables for the current project or discover projects');
  console.log('  search <term> [options]  Search for environment variables by name across projects');
  console.log('  help                     Show this help message');
  console.log('\nOptions for "list":');
  console.log('  -d, --dir <directory>         Target directory to scan (defaults to current directory)');
  console.log('  -s, --depth <number>          Maximum depth to search for environment files (default: 7)');
  console.log('  -m, --mask-env-variables      Mask environment variable values');
  console.log('\nOptions for "search":');
  console.log('  -d, --dir <directory>         Target directory to scan (defaults to current directory)');
  console.log('  -s, --depth <number>          Maximum depth to search for environment files (default: 7)');
  console.log('  -p, --pattern                 Use regex pattern matching instead of text search');
  console.log('  -c, --case-sensitive          Make search case sensitive');
  console.log('  -m, --mask-env-variables      Mask environment variable values');
  console.log('\nExamples:');
  console.log('  henv list');
  console.log('  henv list --dir ./apps --depth 5');
  console.log('  henv search API_KEY');
  console.log('  henv search "^LOG_" --pattern');
  console.log('  henv search api --case-sensitive');
  console.log('  henv search SECRET --mask-env-variables');
  console.log('  henv search PORT --depth 3');
  console.log('  henv search DATABASE --dir /path/to/projects');
  console.log('\nFor more, run henv <command> --help.\n');
  process.exit(0);
}
