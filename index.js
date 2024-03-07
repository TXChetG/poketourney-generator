#! /usr/bin/env node
import { Command } from 'commander';
import generate from './commands/generate.js';
const program = new Command();

program
	.command('new')
	.description('Outputs the TDF file from CSV input')
	.option('-i, --input <input>', 'Input CSV file')
	.option('-p, --popid <popid>', 'Pokemon Organized Play ID')
	.option('-o, --output <output>', 'Output TDF file name')
	.action(generate);

program.parse();
