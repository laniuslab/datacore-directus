import fs from 'fs';
import path from 'path';
import logger from '../../../logger.js';
import { DEFAULT_SEED_JS } from '../../constants/seed.js';

export async function generateMigration(seederName?: string): Promise<void> {
	try {
		if (!seederName) {
			logger.error(`Migration name not found`);
		} else {
			logger.info('Create migration file');

			const filePath = `./extensions/migrations/${+new Date()}_${seederName}.js`;
			const filename = path.resolve(process.cwd(), filePath);

			const directory = path.dirname(filename);

			if (!fs.existsSync(directory)) {
				fs.mkdirSync(directory, { recursive: true });
			}

			fs.writeFileSync(filename, DEFAULT_SEED_JS);

			logger.info(`Migration saved to ${filename}`);
		}

		process.exit(0);
	} catch (err) {
		logger.error(err);
		process.exit(1);
	}
}
