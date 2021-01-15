import { N9ConfBaseConf } from '@neo9/n9-node-conf';
import { N9Log } from '@neo9/n9-node-log';
import { MongoClientOptions } from 'mongodb';
import { N9NodeRouting } from 'n9-node-routing';

export interface Conf extends N9ConfBaseConf {
	// n9-node-micro config
	http?: N9NodeRouting.HttpOptions;
	openapi?: N9NodeRouting.SwaggerOptions;
	log?: N9Log.Options;
	shutdown?: N9NodeRouting.ShutdownOptions;

	// Custom config
	mongo?: {
		url: string;
		options?: MongoClientOptions;
	};
	bodyParser?: {
		limit?: string;
	};
	apis?: {};
	metrics?: {
		isEnabled?: boolean;
		waitDurationMs?: number;
	};
}
