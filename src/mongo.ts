import { Db, MongoClient, ObjectID } from 'mongodb';

export default async function(mongo: { url: string }): Promise<Db> {
	const log = global.log.module('mongo');
	log.info(`Connecting to ${mongo.url}...`);
	const db = (await MongoClient.connect(mongo.url)).db();
	log.info(`Connected`);
	return db;
}

export const oid = (id: string | ObjectID) => id ? new ObjectID(id) : id;
