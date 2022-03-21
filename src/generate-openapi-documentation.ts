import n9NodeConf from '@neo9/n9-node-conf';
import { Container, useContainer } from 'n9-node-routing';
import { generateDocumentationJsonToFile } from 'n9-node-routing/dist/src/generate-documentation-json';
import { join } from 'path';

import { Conf } from './conf/index.models';

useContainer(Container);

function start(): void {
	// Load project conf
	const conf: Conf = n9NodeConf({
		path: join(__dirname, 'conf'),
	});

	generateDocumentationJsonToFile({
		http: conf.http,
		openapi: conf.openapi,
	});
}

start();
