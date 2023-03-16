import { MongoUtils } from '@neo9/n9-mongo-client';
import type { Db, MongoClient } from 'mongodb';
import { Container, N9Log, N9NodeRouting } from 'n9-node-routing';

import { Configuration } from '../../conf/models/configuration.models';

async function initializeMongoClientConnection(
	logger: N9Log,
): Promise<{ dbClient: MongoClient; db: Db }> {
	const conf: Configuration = Container.get('conf');
	const db = await MongoUtils.connect(conf.mongo.url, {
		...conf.mongo.options,
		logger,
	});
	return {
		db,
		dbClient: (global as any).dbClient,
	};
}

function addMongoToPingDbs(dbClient: MongoClient): void {
	const pingDbs: N9NodeRouting.PingDb[] = Container.get('pingDbs');
	pingDbs.push({
		name: 'MongoDB',
		thisArg: dbClient,
		isConnected: dbClient.isConnected,
	});
}

export default async (logger: N9Log): Promise<void> => {
	const { dbClient } = await initializeMongoClientConnection(logger);
	addMongoToPingDbs(dbClient);
};
