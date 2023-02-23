import { MongoUtils } from '@neo9/n9-mongo-client';
import { Server } from 'http';
import type { Db } from 'mongodb';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { cb, N9Log } from 'n9-node-routing';
import { PartialDeep } from 'type-fest';

import { Configuration } from '../../src/conf/models/configuration.models';
import { start } from '../../src/start';
import { mockAndCatchStd } from './std-mock.utils';

export const apiContext: {
	mongodInMemoryServer?: MongoMemoryServer;
	server?: Server;
	conf?: Configuration;
} = {};

async function mongoConnect(mongoUri: string): Promise<Db> {
	// MongoUtils read global.log to get logger
	const oldLog = global.log; // may be undefined
	global.log = new N9Log('mongo');
	const db = await MongoUtils.connect(mongoUri);
	global.log = oldLog;
	return db;
}

async function cleanDb(mongoUri: string): Promise<void> {
	const db = await mongoConnect(mongoUri);
	const collections = await db.collections();
	for (const collection of collections) {
		await collection.deleteMany({});
	}
}

async function generateMongoUri(options?: { tryToUseLocalMongo: boolean }): Promise<string> {
	const log = new N9Log('mongo');

	if (options?.tryToUseLocalMongo) {
		const localMongoUri = 'mongodb://127.0.0.1:27017';
		try {
			await mongoConnect(localMongoUri);
			log.warn(`Using local MongoDB`);
			return localMongoUri;
		} catch (e) {
			if (e.name !== 'MongoNetworkError') {
				throw e;
			}
		}
	}

	log.warn(`Using MongoDB in memory`);
	apiContext.mongodInMemoryServer = await MongoMemoryServer.create({
		binary: {
			version: '6.0.4',
		},
	});
	return apiContext.mongodInMemoryServer.getUri();
}

async function stopMongoInMemoryServer(): Promise<void> {
	await apiContext.mongodInMemoryServer?.stop();
}

async function stopHttpServer(): Promise<void> {
	await cb(apiContext.server.close.bind(apiContext.server));
}

export async function startAPI(
	confOverride?: PartialDeep<Configuration>,
	doCleanDb: boolean = true,
): Promise<void> {
	const { error } = await mockAndCatchStd(async () => {
		process.env.NODE_ENV = 'test';

		const mongoConnectionString = await generateMongoUri({ tryToUseLocalMongo: true });
		if (doCleanDb) {
			await cleanDb(mongoConnectionString);
		}
		const { server, conf } = await start({
			n9NodeRoutingOptions: {
				logOptions: {
					// make format to JSON due to incompatible between std-mocks and pino
					formatJSON: true,
				},
				enableLogFormatJSON: true,
			},
			mongo: {
				url: mongoConnectionString,
			},
			...confOverride,
		});

		apiContext.server = server;
		apiContext.conf = conf;
	});
	if (error) {
		throw error;
	}
}

export const stopAPI = async (): Promise<void> => {
	await stopHttpServer();
	await stopMongoInMemoryServer();
};
