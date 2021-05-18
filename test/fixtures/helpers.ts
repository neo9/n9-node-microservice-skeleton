// tslint:disable:ordered-imports
import src from '../../src';
import n9NodeLog from '@neo9/n9-node-log';
import { cb, N9Error } from '@neo9/n9-node-utils';
import { Server } from 'http';
import { Db } from 'mongodb';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { N9HttpClient } from 'n9-node-routing';
import { join } from 'path';
import * as stdMocks from 'std-mocks';
import { Conf } from '../../src/conf/index.models';
import { UserDetails } from '../../src/modules/users/users.models';

const print = true;

export interface TestContext {
	mongodServer: MongoMemoryServer;
	server: Server;
	session: string;
	user: UserDetails;
	conf: Conf;
	db: Db;
}
export let context: Partial<TestContext> = {};

/* istanbul ignore next */
const url = (path: string = '/') => `http://localhost:${context.conf.http.port}${join('/', path)}`;

export async function get<T extends string | object = object>(
	path: string,
	responseType: 'text' | 'json' = 'json',
	queryParams?: object,
	headers?: object,
): Promise<{
	body: T;
	err: N9Error;
	stdout: string[];
	stderr: string[];
}> {
	const httpClient = getHttpClient(responseType);
	return await wrapLogs<T>(httpClient.get<T>(url(path), queryParams, headers));
}

// istanbul ignore next
export async function post<T>(
	path: string,
	body: any,
): Promise<{
	body: T;
	err: N9Error;
	stdout: string[];
	stderr: string[];
}> {
	const httpClient = getHttpClient('json');
	return await wrapLogs<T>(httpClient.post<T>(url(path), body));
}

// istanbul ignore next
export async function put<T>(
	path: string,
	body: any,
): Promise<{
	body: T;
	err: N9Error;
	stdout: string[];
	stderr: string[];
}> {
	const httpClient = getHttpClient('json');
	return await wrapLogs<T>(httpClient.put<T>(url(path), body));
}

export const startAPI = async (confOverride?: Conf) => {
	stdMocks.use({ print });
	// Set env to 'test'
	process.env.NODE_ENV = 'test';
	// Start again (to init files)

	context.mongodServer = new MongoMemoryServer({
		binary: {
			version: '4.2.2',
		},
		// debug: true,
	});
	const mongoConnectionString = await context.mongodServer.getConnectionString();
	const { server, db, conf } = await src({
		log: {
			formatJSON: false,
		},
		enableLogFormatJSON: false,
		mongo: {
			url: mongoConnectionString,
		},
		...confOverride,
	});

	// Add variables to t.context
	context.server = server;
	context.db = db;
	context.conf = conf;
	// Flush logs output
	stdMocks.flush();
	stdMocks.restore();
};

export const stopAPI = async () => {
	await cb(context.server.close.bind(context.server));
	await context.mongodServer.stop();
};

async function wrapLogs<T>(
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
	// Get logs ouput & check logs
	const { stdout, stderr } = stdMocks.flush();
	// Restore logs output
	stdMocks.restore();
	return { body, err, stdout, stderr };
}

function getHttpClient(responseType: 'text' | 'json'): N9HttpClient {
	return new N9HttpClient(global.log ?? n9NodeLog('test'), { responseType });
}
