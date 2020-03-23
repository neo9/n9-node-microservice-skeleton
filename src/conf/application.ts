import { Conf } from './index';

const conf: Conf = {
	http: {
		port: process.env.PORT || 6686,
	},
};

export default conf;
