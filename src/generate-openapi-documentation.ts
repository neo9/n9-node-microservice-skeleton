/* tslint:disable:ordered-imports */
import 'reflect-metadata';
import { getFromContainer, MetadataStorage, useContainer } from 'class-validator';
import { Container as iocContainer } from 'typedi';
useContainer(iocContainer, {});
iocContainer.set(MetadataStorage, getFromContainer(MetadataStorage));

import { join } from 'path';
import n9NodeConf from '@neo9/n9-node-conf';
import { Conf } from './conf/index.models';
import { generateDocumentationJsonToFile } from 'n9-node-routing/dist/src/generate-documentation-json';

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
