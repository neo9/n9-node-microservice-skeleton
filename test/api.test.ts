import ava, { Assertions } from 'ava';

import { get, startAPI, stopAPI } from './fixtures';

ava.before('Start API', async () => {
	await startAPI({}, true);
});

// todo on init skeleton: replace n9-node-microservice-skeleton by api name
ava.serial('GET / => n9-node-microservice-skeleton', async (t: Assertions) => {
	const { body, stdout, stderr } = await get<{ name: string }>('/', 'json');
	// todo on init skeleton: replace n9-node-microservice-skeleton by api name
	t.deepEqual(body, { name: 'n9-node-microservice-skeleton' });
	t.is(stderr.length, 0, `Request has errors: ${JSON.stringify(stderr)}`);
	t.true(stdout.length > 0, 'Request had no success message');
	t.true(stdout.join('\n').includes('"path":"/"'));
	t.true(stdout.join('\n').includes('"method":"GET"'));
	t.true(stdout.join('\n').includes('"status":"200"'));
});

ava.serial('GET /ping => pong-db', async (t: Assertions) => {
	const { body, stdout, stderr } = await get<object>('/ping', 'json');
	const nbDbs = ['mongodb'].length;
	t.deepEqual(body, { response: `pong-dbs-${nbDbs}` });
	t.is(stderr.length, 0, `Request has errors: ${JSON.stringify(stderr)}`);
	t.not(stdout.length, 0, 'Request had no success message');
	t.true(stdout.length > 0, 'Request had no success message');
	t.true(stdout.join('\n').includes('"path":"/ping"'));
	t.true(stdout.join('\n').includes('"method":"GET"'));
	t.true(stdout.join('\n').includes('"status":"200"'));
});

ava('GET /routes => 1 routes', async (t: Assertions) => {
	const { body } = await get<any[]>('/routes');
	t.is(body.length, 1);
});

ava.serial('GET /404 => 404 status code', async (t: Assertions) => {
	const { err } = await get('/404');
	t.is(err.status, 404);
	t.is(err.message, 'not-found');
	t.is(err.context.srcError.context.url, '/404');
});

ava.after('Stop server', async () => {
	await stopAPI();
});
