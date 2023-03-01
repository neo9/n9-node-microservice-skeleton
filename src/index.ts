// eslint-disable-next-line import/no-extraneous-dependencies
import 'reflect-metadata';
// Add source map supports
import 'source-map-support/register';

// eslint-disable-next-line import/no-extraneous-dependencies
import fastSafeStringify from 'fast-safe-stringify';

import { start } from './start';

start()
	.then(() => {
		(global.log || console).info('Launch SUCCESS !');
	})
	.catch((e) => {
		(global.log || console).error(`Error on launch : `, { errString: fastSafeStringify(e) });
		throw e;
	});
