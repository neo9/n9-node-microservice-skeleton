import { Conf } from './index.models';

const conf: Conf = {
	http: {
		port: process.env.PORT || 8080,
	},
	mongo: {
		url: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/app-name',
	},
	metrics: {
		isEnabled: true,
		waitDurationMs: 30 * 1_000,
	},
};

export default conf;
