#!/usr/bin/env node

/**
 * DeadmauC - A programming language inspired by Deadmau5
 *
 * "We are the music makers, and we are the dreamers of dreams."
 */

const fs = require('fs');
const path = require('path');
const { Lexer } = require('./lexer');
const { Parser } = require('./parser');
const { Interpreter } = require('./interpreter');

const VERSION = '1.0.0';

function printUsage() {
  console.log(`
DeadmauC v${VERSION}
A programming language inspired by Deadmau5

Usage:
  deadmauc <file.mau5>     Run a DeadmauC program
  deadmauc --help          Show this help message
  deadmauc --version       Show version

File extension: .mau5

Example:
  deadmauc hello.mau5
`);
}

function printVersion() {
  console.log(`DeadmauC v${VERSION}`);
}

async function runFile(filePath) {
  // Resolve the file path
  const resolvedPath = path.resolve(filePath);

  // Check if file exists
  if (!fs.existsSync(resolvedPath)) {
    console.error(`Error: File not found: ${resolvedPath}`);
    process.exit(1);
  }

  // Read the source code
  const source = fs.readFileSync(resolvedPath, 'utf-8');

  try {
    // Lexing
    const lexer = new Lexer(source);
    const tokens = lexer.tokenize();

    // Parsing
    const parser = new Parser(tokens);
    const ast = parser.parse();

    // Interpreting
    const interpreter = new Interpreter();
    await interpreter.run(ast);

  } catch (error) {
    console.error(`\n🎧 DeadmauC Error:`);
    console.error(`   ${error.message}`);
    process.exit(1);
  }
}

// Main entry point
async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    printUsage();
    process.exit(0);
  }

  const arg = args[0];

  if (arg === '--help' || arg === '-h') {
    printUsage();
    process.exit(0);
  }

  if (arg === '--version' || arg === '-v') {
    printVersion();
    process.exit(0);
  }

  // Run the file
  await runFile(arg);
}

main().catch(error => {
  console.error('Fatal error:', error.message);
  process.exit(1);
});
