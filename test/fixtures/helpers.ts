import n9NodeLog from '@neo9/n9-node-log';
import { N9HttpClient } from 'n9-node-routing';
import { join } from 'path';
import * as stdMocks from 'std-mocks';
import { cb, N9Error } from '@neo9/n9-node-utils';
import { MongoMemoryServer } from 'mongodb-memory-server';
import src from '../../src';
import { Server } from 'http';
import { UserDetails } from '../../src/modules/users/users.models';
import { Conf } from '../../src/conf';
import { Db } from 'mongodb';

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
	return await wrapLogs<T>(httpClient.put<T>(url(path)));
}

export const startAPI = async () => {
	stdMocks.use();
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
		mongo: {
			url: mongoConnectionString,
		},
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
	stdMocks.use();
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
	const httpClient = new N9HttpClient(global.log ?? n9NodeLog('test'), { responseType });
	return httpClient;
}
