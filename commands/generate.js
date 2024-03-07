import chalk from 'chalk';
import fs from 'fs';
import csv from 'csv-parser';
import { create } from 'xmlbuilder2';

const generate = async function ({ input, popid, output }) {
	if (!input) {
		console.log(
			chalk.red.bold('Error: ') +
				chalk.red(
					'You must include an input file to be processed. Use the -i or --input flag.'
				)
		);
		return;
	}
	if (!output) {
		// If no output name is provided, replace the .csv extension with .tdf
		output = input.replace('.csv', '.tdf');
	}

	const playersObj = await processCSV(input);

	writeXML(playersObj, popid, output);
};

const processCSV = async function (input) {
	console.log(chalk.yellow.italic('Processing CSV file...'));
	let rowCount = 0;
	let players = {};
	input = input.replace(/['"]+/g, '');
	console.log(chalk.blue('Input file: ' + input));

	try {
		players = await new Promise((resolve, reject) => {
			const playersTemp = {};
			fs.createReadStream(input)
				.on('error', reject)
				.pipe(csv())
				.on('data', (row) => {
					rowCount++;
					let nameArray = row['Player Name'].split(' ');
					let firstName = nameArray[0];
					let lastName =
						nameArray.length > 1 ? nameArray[nameArray.length - 1] : '';
					let birthDate = new Date(row['Date of Birth']);
					let formattedBirthDate = `${
						birthDate.getMonth() + 1
					}/${birthDate.getDate()}/${birthDate.getFullYear()}`;

					// for each row add playerObj to players
					let playerObj = {
						firstname: firstName,
						lastname: lastName,
						birthdate: formattedBirthDate,
					};
					playersTemp[row['Player ID']] = playerObj;
				})
				.on('end', () => {
					console.log(chalk.blue(`Processed ${rowCount} players.`));
					resolve(playersTemp);
				});
		});
	} catch (error) {
		console.log(chalk.red('Error reading filestream: ', error));
	}

	return players;
};

const writeXML = async function (players, popid, output) {
	console.log(chalk.yellow.italic('Writing XML file...'));

	if (!popid) {
		console.log(
			chalk.yellow.inverse('Warning:') +
				chalk.yellow(
					' You did not include a PopId. Use the -p or --popid flag, a default value will be used.'
				)
		);
		popid = '000000';
	}

	let root = create({ version: '1.0', encoding: 'UTF-8' })
		.ele('tournament', {
			type: '2',
			stage: '0',
			version: '1.72',
			gametype: 'VIDEO_GAME',
			mode: 'VGCPREMIER',
		})
		.ele('data')
		.ele('name')
		.txt(' ')
		.up()
		.ele('id')
		.txt(' ')
		.up()
		.ele('city')
		.txt(' ')
		.up()
		.ele('state')
		.txt(' ')
		.up()
		.ele('country')
		.txt(' ')
		.up()
		.ele('roundtime')
		.txt('0')
		.up()
		.ele('finalsroundtime')
		.txt('0')
		.up()
		.ele('organizer', { popid: popid })
		.txt(' ')
		.up()
		.ele('startdate')
		.txt(' ')
		.up()
		.ele('lessswiss')
		.txt('false')
		.up()
		.ele('autotablenumber')
		.txt('true')
		.up()
		.ele('overflowtablestart')
		.txt('0')
		.up()
		.up()
		.ele('timeelapsed')
		.txt('0')
		.up();

	let playersElement = root.ele('players');

	for (let player in players) {
		let playerObj = players[player];
		playersElement
			.ele('player', { userid: player })
			.ele('firstname')
			.txt(playerObj.firstname)
			.up()
			.ele('lastname')
			.txt(playerObj.lastname)
			.up()
			.ele('birthdate')
			.txt(playerObj.birthdate)
			.up()
			.ele('creationdate')
			.txt(' ')
			.up()
			.ele('lastmodifieddate')
			.txt(' ')
			.up()
			.up();
	}

	playersElement
		.up()
		.ele('pods')
		.txt(' ')
		.up()
		.ele('finalsoptions')
		.txt(' ')
		.up()
		.up();

	let tdf = root.end({ prettyPrint: true });

	fs.writeFile(output, tdf, (err) => {
		if (err) {
			console.log(chalk.red('Error writing file: ', err));
		}
		console.log(
			chalk.green.bold('Success:') +
				' ' +
				chalk.green('Your file can be found at') +
				' ' +
				chalk.green.underline(output)
		);
	});
};

export default generate;
