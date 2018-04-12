import { N9Log } from '@neo9/n9-node-log';
import { RoutingControllerWrapper } from 'routing-controllers-wrapper';

export interface Conf {
	// n9-micro config
	http?: RoutingControllerWrapper.HttpOptions;
	log?: N9Log.Options;
	env?: string;
	name?: string;
	version?: string;

	// Custom config
	mongo?: {
		url: string;
	};
	io?: {
		enabled: boolean;
	};
}
