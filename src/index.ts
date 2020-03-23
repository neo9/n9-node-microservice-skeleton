import { MongoUtils } from '@neo9/n9-mongo-client';
import n9Conf from '@neo9/n9-node-conf';
// Dependencies
import n9Log from '@neo9/n9-node-log';
import { Server } from 'http';
import { Db } from 'mongodb';
import routingControllersWrapper from 'n9-node-routing';
import { join } from 'path';
// Add source map supports
// tslint:disable:no-import-side-effect
import 'source-map-support/register';
import { Conf } from './conf';

// Start method
async function start(
	confOverride: Partial<Conf> = {},
): Promise<{ server: Server; db: Db; conf: Conf }> {
	// Load project conf & set as global
	const conf = (global.conf = n9Conf({
		path: join(__dirname, 'conf'),
		override: {
			value: confOverride,
		},
	}) as Conf);
	// Load logging system
	const log = (global.log = n9Log(conf.name, global.conf.log));
	// Load loaded configuration
	log.info(`Conf loaded: ${conf.env}`);

	// Profile startup boot time
	log.profile('startup');
	// print app infos
	const initialInfos = `${conf.name} version : ${conf.version} env: ${conf.env}`;
	log.info('-'.repeat(initialInfos.length));
	log.info(initialInfos);
	log.info('-'.repeat(initialInfos.length));

	// Connect to MongoDB
	const db = (global.db = await MongoUtils.connect(conf.mongo.url));
	// Load modules
	const { server } = await routingControllersWrapper({
		hasProxy: true,
		path: join(__dirname, 'modules'),
		http: conf.http,
	});

	// Log the startup time
	log.profile('startup');
	// Return server and more for testing
	return { server, db, conf };
}

// Start server if not in test mode
/* istanbul ignore if */
if (process.env.NODE_ENV !== 'test') {
	start()
		.then(() => {
			(global.log || console).info('Launch SUCCESS !');
		})
		.catch((e) => {
			(global.log || console).error('Error on lauch', e);
			throw e;
		});
}

export default start;
