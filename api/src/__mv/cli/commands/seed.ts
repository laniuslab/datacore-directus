import fs from 'fs';
import path from 'path';
import getDatabase from '../../../database/index.js';
import run from '../../../database/migrations/run.js';
import logger from '../../../logger.js';
import { DEFAULT_SEED_JS } from '../constants/seed.js';

export async function generateSeeder({ name }: { name: string }): Promise<void> {
	try {
		if (!name) {
			logger.error(`Seeder name not found`);
		} else {
			logger.info('Create seeder file');

			const filePath = `./extensions/seeders/${+new Date()}-${name}.js`;
			const filename = path.resolve(process.cwd(), filePath);

			const directory = path.dirname(filename);

			if (!fs.existsSync(directory)) {
				fs.mkdirSync(directory, { recursive: true });
			}

			fs.writeFileSync(filename, DEFAULT_SEED_JS);

			logger.info(`Seeder saved to ${filename}`);
		}

		process.exit(0);
	} catch (err) {
		logger.error(err);
		process.exit(1);
	}
}

export async function runSeeder(direction: 'latest' | 'up' | 'down'): Promise<void> {
	const database = getDatabase();

	try {
		logger.info('Running seeders...');

		await run(database, direction, true, 'seeders');

		if (direction === 'down') {
			logger.info('Downgrade successful');
		} else {
			logger.info('Database up to date');
		}

		database.destroy();
		process.exit();
	} catch (err: any) {
		logger.error(err);
		database.destroy();
		process.exit(1);
	}
}
