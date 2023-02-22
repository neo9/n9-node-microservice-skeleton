import { PartialDeep } from 'type-fest';

import { Configuration } from './models/configuration.models';

const conf: PartialDeep<Configuration> = {
	n9NodeRoutingOptions: {
		http: {
			port: 6666,
		},
	},
	mongo: {
		url: 'mongodb://127.0.0.1:27017/skeleton-api', // todo on init skeleton: Rename database name
	},
};

export default conf;
