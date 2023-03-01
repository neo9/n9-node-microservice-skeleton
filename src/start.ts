import { Server } from 'http';
import type { Db } from 'mongodb';
import n9NodeRouting, { Container, N9NodeRouting } from 'n9-node-routing';
import { PartialDeep } from 'type-fest';

import { Configuration } from './conf/models/configuration.models';

export async function start(
	confOverride: PartialDeep<Configuration> = {},
): Promise<{ server: Server; db: Db; conf: Configuration }> {
	const pingDbs: N9NodeRouting.PingDb[] = [];
	Container.set('pingDbs', pingDbs);
	const callbacksBeforeShutdown: N9NodeRouting.CallbacksBeforeShutdown[] = [];
	Container.set('callbacksBeforeShutdown', callbacksBeforeShutdown);
	const callbacksOnShutdownSignalReceived: N9NodeRouting.CallbacksBeforeShutdown[] = [];
	Container.set('callbacksOnShutdownSignalReceived', callbacksOnShutdownSignalReceived);

	// Load modules
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
			'mongo.init.ts', // We need to did this init before all others because some init files need mongo connection or some services/repositories that need mongo connection
		],
		conf: {
			n9NodeConf: {
				extendConfig: {
					path: {
						relative: './env/env.yaml',
					},
					key: 'skeletonApi', // todo on init skeleton: Rename this key // todo duplicate this todo
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

	return { server, db, conf };
}
