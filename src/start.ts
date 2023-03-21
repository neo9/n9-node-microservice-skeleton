import { Server } from 'http';
import n9NodeRouting, { Container, N9NodeRouting } from 'n9-node-routing';
import { PartialDeep } from 'type-fest';

import { Configuration } from './conf/models/configuration.models';

export async function start(
	confOverride: PartialDeep<Configuration> = {},
): Promise<{ server: Server; conf: Configuration }> {
	const pingDbs: N9NodeRouting.PingDb[] = [];
	Container.set('pingDbs', pingDbs);
	const callbacksBeforeShutdown: N9NodeRouting.CallbacksBeforeShutdown[] = [];
	Container.set('callbacksBeforeShutdown', callbacksBeforeShutdown);
	const callbacksOnShutdownSignalReceived: N9NodeRouting.CallbacksBeforeShutdown[] = [];
	Container.set('callbacksOnShutdownSignalReceived', callbacksOnShutdownSignalReceived);

	const { server, conf } = await n9NodeRouting({
		hasProxy: true,
		http: {
			ping: {
				dbs: pingDbs,
			},
		},
		shutdown: {
			callbacksBeforeShutdown,
			callbacksOnShutdownSignalReceived,
		},
		firstSequentialInitFileNames: [
			'mongo', // We need to do this init before all others because some init files need mongo connection or some services/repositories that need mongo connection
		],
		conf: {
			n9NodeConf: {
				extendConfig: {
					path: {
						relative: './env/env.yaml',
					},
					key: 'skeletonApi', // todo on init skeleton: Rename this key (update also in ./env/env.yaml with same value)
				},
				override: {
					value: confOverride,
				},
			},
			validation: {
				isEnabled: true,
				classType: Configuration,
			},
		},
	});

	return { server, conf };
}
