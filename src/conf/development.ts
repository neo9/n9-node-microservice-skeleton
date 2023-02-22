import { PartialDeep } from 'type-fest';

import { Configuration } from './models/configuration.models';

const conf: PartialDeep<Configuration> = {
	n9NodeRoutingOptions: {
		shutdown: {
			waitDurationBeforeStop: 500,
		},
	},
};

export default conf;
