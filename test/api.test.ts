// NPM modules
import { cb } from '@neo9/n9-node-utils';
import test, { Assertions } from 'ava';
import { context, get, post, startAPI } from './fixtures/helpers';

/*
** Start API
*/
test.before('Start API', async (t: Assertions) => {
	await startAPI();
});

/*
** Informations routes
*/
test('GET / => n9-node-microservice-skeleton', async (t: Assertions) => {
	const { statusCode, body, stdout, stderr } = await get('/');
	t.is(statusCode, 200);
	t.is(body, 'n9-node-microservice-skeleton');
	t.is(stderr.length, 0);
	t.is(stdout.length, 1);
	t.true(stdout[0].includes('"path":"/"'));
});

test('GET /ping => pong-db', async (t: Assertions) => {
	const { statusCode, body, stdout, stderr } = await get('/ping');
	t.is(statusCode, 200);
	t.is(body, 'pong-db');
	t.is(stderr.length, 0);
	t.is(stdout.length, 1);
	t.true(stdout[0].includes('"path":"/ping"'));
});

test('GET /routes => 1 routes', async (t: Assertions) => {
	const { statusCode, body } = await get('/routes');
	t.is(statusCode, 200);
	t.is(body.length, 1);
});

test('GET /404 => 404 status code', async (t: Assertions) => {
	const { statusCode, body } = await get('/404');
	t.is(statusCode, 404);
	t.is(body.code, 'not-found');
	t.is(body.context.url, '/404');
});

/*
** modules/users/
*/
test('POST /users => 200 with good params', async (t: Assertions) => {
	const { statusCode, body } = await post('/users', {
		body: {
			firstName: 'Neo',
			lastName: 'Nine',
			email: 'neo@neo9.fr',
			password: 'password-long'
		}
	});
	t.is(statusCode, 200);
	t.regex(body._id, /^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i, 'Good _id format');
	t.is(body.firstName, 'Neo');
	t.is(body.lastName, 'Nine');
	t.is(body.email, 'neo@neo9.fr');
	t.falsy(body.password);
	// Add to context
	context.user = body;
	context.session = JSON.stringify({
		userId: body._id
	});
});

test('POST /users => 400 with wrong params', async (t: Assertions) => {
	const { statusCode, body } = await post('/users', {
		body: {
			firstName: 'Neo',
			email: 'newameil' + new Date().getTime() + '@test.com',
			password: 'azerty'
		}
	});
	t.is(statusCode, 400, 'validate wrong => 400');
	t.is(body.code, 'BadRequestError', 'body code : BadRequestError');
});

test('POST /users => 409 with user already exists', async (t: Assertions) => {
	const { statusCode, body } = await post('/users', {
		body: {
			firstName: 'Neo',
			lastName: 'Nine',
			email: 'neo@neo9.fr',
			password: 'password-long'
		}
	});
	t.is(statusCode, 409);
	t.is(body.code, 'user-already-exists');
});

/*
** modules/users/
*/
test('GET /users/:id => 404 with user not found', async (t: Assertions) => {
	const headers = { session: context.session };
	const { statusCode, body } = await get('/users/012345678901234567890123', { headers });
	t.is(statusCode, 404);
	t.is(body.code, 'user-not-found');
});

test('GET /users/:id => 200 with user found', async (t: Assertions) => {
	const headers = { session: context.session };
	const { statusCode, body } = await get(`/users/${context.user._id}`, { headers });
	t.is(statusCode, 200);
	t.is(body.email, context.user.email);
});

/*
** Stop API
*/
test.after('Stop server', async (t: Assertions) => {
	await cb(context.server.close.bind(context.server));
});
