import { N9Log } from '@neo9/n9-node-log';
import { Collection } from 'mongodb';

export default async (log: N9Log) => {
	log = log.module('users');

	log.info('Ensuring email unique index');
	const users: Collection = global.db.collection('users');
	await users.createIndex({ email: 1 }, { unique: true });
};
