import { Conf } from './index.d';

const conf: Conf = {
	http: {
		port: 6666
	},
	mongo: {
		url: 'mongodb://127.0.0.1:27017/n9-micro-test'
	}
};

export default conf;
