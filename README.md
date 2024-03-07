# Pokemon Tournament Generator CLI

This very simple CLI tool consumes a CSV file, and then outputs that file as a `.tdf` ready to start a new Pokemon tournament.

## Installation

1. Clone this repo to your local machine.
2. Run `npm i -g`.
   - This will install the dependencies plus register the CLI command with your machine.

## Usage

From your terminal you can now run `poketourney`.

### Options

The following options are available:

| Option     | Description              |
| ---------- | ------------------------ |
| -h, --help | display help for command |

### Commands

The following commands are available

| Command        | Description                         |
| -------------- | ----------------------------------- |
| new [options]  | Outputs the TDF file from CSV input |
| help [command] | display help for command            |

## Generating a TDF

This is very straightforward, using `poketourney new` with the available options:

`poketourney new --input ~/path/to/file.csv --popid {your PopId} --output ~/path/you/want/file.tdf`

### Additional Notes

**--input** is a required option. Without this the command will throw an error.

**--popid** will default to _000000_

**--output** will default to the input value with updated file extension.
