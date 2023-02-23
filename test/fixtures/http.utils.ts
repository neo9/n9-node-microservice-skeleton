import { StringMap } from '@neo9/n9-mongo-client';
import { N9Error, N9HttpClient, N9Log } from 'n9-node-routing';
import { join } from 'path';

import { apiContext } from './api.utils';
import { mockAndCatchStd } from './std-mock.utils';

interface HttpResult<T> {
	body?: T;
	err?: N9Error;
	stdout: string[];
	stderr: string[];
}

const httpLogger = new N9Log('test');
const defaultSession = JSON.stringify({ userId: '0' });

function url(path: string | string[] = '/'): string | string[] {
	const httpPort = apiContext.conf.n9NodeRoutingOptions.http.port;
	if (Array.isArray(path)) return [`http://localhost:${httpPort}`, ...path];
	return `http://localhost:${httpPort}${join('/', path)}`;
}

async function wrapLogs<T>(apiCall: Promise<T>): Promise<HttpResult<T>> {
	const { result, stderr, stdout, error } = await mockAndCatchStd(async () => apiCall);
	return { stdout, stderr, body: result, err: error as N9Error };
}

function getHttpClient(responseType: 'text' | 'json'): N9HttpClient {
	return new N9HttpClient(httpLogger, { responseType });
}

export async function get<T extends string | object = object>(
	path: string,
	responseType: 'text' | 'json' = 'json',
	queryParams?: StringMap<any>,
	headers?: StringMap<any>,
): Promise<HttpResult<T>> {
	const httpClient = getHttpClient(responseType);
	return await wrapLogs<T>(
		httpClient.get<T>(url(path), queryParams, {
			session: defaultSession,
			headers,
		}),
	);
}

export async function post<B = any, T = object>(
	path: string | string[],
	body: B,
	queryParams?: StringMap<any>,
	headers?: StringMap<any>,
): Promise<HttpResult<T>> {
	const httpClient = getHttpClient('json');
	return await wrapLogs<T>(
		httpClient.post<T>(url(path), body, queryParams, {
			session: defaultSession,
			...headers,
		}),
	);
}

export async function put<B = any, T = object>(
	path: string | string[],
	body: B,
	queryParams?: StringMap<any>,
	headers?: StringMap<any>,
): Promise<HttpResult<T>> {
	const httpClient = getHttpClient('json');
	return await wrapLogs<T>(
		httpClient.put<T>(url(path), body, queryParams, {
			session: defaultSession,
			...headers,
		}),
	);
}

export async function patch<B = any, T = object>(
	path: string | string[],
	body?: B,
	queryParams?: StringMap<any>,
	headers?: StringMap<any>,
): Promise<HttpResult<T>> {
	const httpClient = getHttpClient('json');
	return await wrapLogs<T>(
		httpClient.patch<T>(url(path), body, queryParams, {
			session: defaultSession,
			...headers,
		}),
	);
}
