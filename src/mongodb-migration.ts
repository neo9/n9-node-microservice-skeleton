import { N9MongodbMigration } from '@neo9/n9-mongodb-migration';
import * as path from 'path';

async function start(): Promise<void> {
	const n9MongodbMigration = new N9MongodbMigration({
		migrationScriptsFolderPath: path.join(__dirname, '../mongodb-migration-scripts'),
		mongodbURI: process.env.MONGODB_URI
			? process.env.MONGODB_URI
			: `mongodb://${process.env.MONGO_URI || '127.0.0.1:27017/catalogue-master-api'}`,
		mongodbOptions: {
			socketTimeoutMS: 15 * 60 * 1000, // 15 min
		},
	});

	await n9MongodbMigration.apply();
}

start()
	.then(() => {
		(global.log || console).info('Migration SUCCESS !');
		process.exit(0);
	})
	.catch((e) => {
		(global.log || console).error('Error while migrate', e);
		process.exit(1);
	});
