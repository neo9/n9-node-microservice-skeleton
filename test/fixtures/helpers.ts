import { MongoUtils, StringMap } from '@neo9/n9-mongo-client';
import type { Db } from 'mongodb';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { cb, Container, N9Error, N9HttpClient, N9Log } from 'n9-node-routing';
import { join } from 'path';
import * as stdMocks from 'std-mocks';
import * as Mockito from 'ts-mockito';
import { Class, PartialDeep } from 'type-fest';

import { Configuration } from '../../src/conf/models/configuration.models';
import { start } from '../../src/start';

export const print = true;
export const context: { mongodServer?: MongoMemoryServer; [key: string]: any } = {};

export const cleanDb = async (db: Db): Promise<void> => {
	const collections = await db.collections();
	for (const collection of collections) {
		await collection.deleteMany({});
	}
};

export const startAPI = async (
	confOverride?: PartialDeep<Configuration>,
	doCleanDb: boolean = true,
): Promise<void> => {
	stdMocks.use({ print });
	// Set env to 'test'
	process.env.NODE_ENV = 'test';
	// Start again (to init files)

	let mongoConnectionString;
	try {
		global.log = new N9Log('mongo');
		await MongoUtils.connect('mongodb://127.0.0.1:27017', {});
		global.log.warn(`Using local MongoDB`);
	} catch (e) {
		if (e.name === 'MongoNetworkError') {
			global.log.warn(`Using MongoDB in memory`);
			// no classic mongodb available, so use one in memory
			context.mongodServer = await MongoMemoryServer.create({
				binary: {
					version: '6.0.4',
				},
			});

			mongoConnectionString = context.mongodServer.getUri();
		} else {
			throw e;
		}
	}
	if (doCleanDb) {
		const db = await MongoUtils.connect(mongoConnectionString || 'mongodb://127.0.0.1:27017', {});
		await cleanDb(db);
	}
	const { server, conf } = await start({
		n9NodeRoutingOptions: {
			logOptions: {
				// make format to JSON due to incompatible between std-mocks and pino
				formatJSON: true,
			},
			enableLogFormatJSON: true,
		},
		mongo: {
			url: mongoConnectionString,
		},
		...confOverride,
	});

	// Add variables to context
	context.server = server;
	context.conf = conf;
	// Flush logs output
	stdMocks.flush();
	stdMocks.restore();
};

export const stopAPI = async (): Promise<void> => {
	await cb(context.server.close.bind(context.server));
	await context.mongodServer?.stop();
};

/* istanbul ignore next */
const url = (path: string | string[] = '/'): string | string[] => {
	const httpPort = context.conf.n9NodeRoutingOptions.http.port;
	if (Array.isArray(path)) return [`http://localhost:${httpPort}`, ...path];
	return `http://localhost:${httpPort}${join('/', path)}`;
};

// helper that takes a list of class and returns a list of instances
export function inject<T extends Class[]>(
	...services: T
): {
	[K in keyof T]: T[K] extends Class ? InstanceType<T[K]> : never;
};
export function inject<T extends any[]>(...manyServiceClass: T): any[] {
	const args = manyServiceClass.map((serviceClass) => {
		return Container.get(serviceClass);
	});
	return args as any;
}

export const getMockedName = (serviceClass: Class): string => `__mock__${serviceClass.name}__`;

// override a service in the container
export function overrideService<T extends Class>(serviceClass: T, instance: any): void {
	Container.remove(serviceClass);
	Container.set(serviceClass, instance);
}

// mock a service, register the service instance and the mock, and return the mocked service class
export function mockService<T extends Class>(serviceClass: T): InstanceType<T> {
	const mockedServiceClass = Mockito.mock(serviceClass);
	Container.remove(serviceClass);
	Container.set(serviceClass, Mockito.instance(mockedServiceClass));
	Container.set(getMockedName(serviceClass), mockedServiceClass);
	return mockedServiceClass;
}

export async function wrapLogs<T>(
	apiCall: Promise<T>,
): Promise<{ body: T; err: N9Error; stdout: string[]; stderr: string[] }> {
	// Store logs output
	stdMocks.use({ print });
	// Call API & check response
	let body = null;
	let err = null;
	try {
		body = await apiCall;
	} catch (error) {
		err = error;
	}
	// Get logs output & check logs
	const { stdout, stderr } = stdMocks.flush();
	// Restore logs output
	stdMocks.restore();
	return { body, err, stdout, stderr };
}

function getHttpClient(responseType: 'text' | 'json'): N9HttpClient {
	return new N9HttpClient(global.log ?? new N9Log('test'), { responseType });
}

export async function get<T extends string | object = object>(
	path: string,
	responseType: 'text' | 'json' = 'json',
	queryParams?: StringMap<any>,
	headers?: StringMap<any>,
): Promise<{
	body: T;
	err: N9Error;
	stdout: string[];
	stderr: string[];
}> {
	const httpClient = getHttpClient(responseType);
	return await wrapLogs<T>(httpClient.get<T>(url(path), queryParams, headers));
}

export async function post<B = any, T = object>(
	path: string | string[],
	body: B,
	queryParams?: StringMap<any>,
	headers?: StringMap<any>,
): Promise<{
	body: T;
	err: N9Error;
	stdout: string[];
	stderr: string[];
}> {
	const httpClient = getHttpClient('json');
	return await wrapLogs<T>(
		httpClient.post<T>(url(path), body, queryParams, {
			session: JSON.stringify({ userId: '0' }),
			...headers,
		}),
	);
}

export async function put<B = any, T = object>(
	path: string | string[],
	body: B,
	queryParams?: StringMap<any>,
	headers?: StringMap<any>,
): Promise<{
	body: T;
	err: N9Error;
	stdout: string[];
	stderr: string[];
}> {
	const httpClient = getHttpClient('json');
	return await wrapLogs<T>(
		httpClient.put<T>(url(path), body, queryParams, {
			session: JSON.stringify({ userId: '0' }),
			...headers,
		}),
	);
}

export async function patch<B = any, T = object>(
	path: string | string[],
	body?: B,
	queryParams?: StringMap<any>,
	headers?: StringMap<any>,
): Promise<{
	body: T;
	err: N9Error;
	stdout: string[];
	stderr: string[];
}> {
	const httpClient = getHttpClient('json');
	return await wrapLogs<T>(
		httpClient.patch<T>(url(path), body, queryParams, {
			session: JSON.stringify({ userId: '0' }),
			...headers,
		}),
	);
}
