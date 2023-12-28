/**
 * Custom properties on the req object in express
 */

import { Accountability, SchemaOverview } from '@directus/types';
import { Query } from '../__mv/index.ts'; // MV-DATACORE

export {};

declare global {
	namespace Express {
		export interface Request {
			token: string | null;
			collection: string;
			sanitizedQuery: Query;
			schema: SchemaOverview;

			accountability?: Accountability;
			singleton?: boolean;
		}
	}
}
