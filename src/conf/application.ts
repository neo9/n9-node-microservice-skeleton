import { PartialDeep } from 'type-fest';

import { Configuration } from './models/configuration.models';

const conf: PartialDeep<Configuration> = {
	n9NodeRoutingOptions: {
		http: {
			port: process.env.PORT || 8080, // todo on init skeleton: Define your default port
		},
	},
	mongo: {
		url: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/skeleton-api', // todo on init skeleton: Rename database name
	},
	apis: {
		myApiName1: {
			url: 'http://my-api-name-1.com',
			cacheDuration: 1000,
		},
		myApiName2: {
			url: 'http://my-api-name-2.com',
			bulkSize: 100,
		},
	},
};

export default conf;
