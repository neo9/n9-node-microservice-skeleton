import { MongoUtils } from '@neo9/n9-mongo-client';
import { Container, N9Log, N9NodeRouting } from 'n9-node-routing';

import { Configuration } from '../../conf/models/configuration.models';

async function initializeMongoClientConnection(logger: N9Log): Promise<void> {
	const conf: Configuration = Container.get('conf');
	await MongoUtils.connect(conf.mongo.url, {
		...conf.mongo.options,
		logger,
	});
}

function addMongoToPingDbs(): void {
	const pingDbs: N9NodeRouting.PingDb[] = Container.get('pingDbs');
	pingDbs.push({
		name: 'MongoDB',
		thisArg: global.dbClient,
		isConnected: global.dbClient.isConnected,
	});
}

export default async (logger: N9Log): Promise<void> => {
	await initializeMongoClientConnection(logger);
	addMongoToPingDbs();
};
