// NPM modules
import { cb } from '@neo9/n9-node-utils';
import ava, { ExecutionContext } from 'ava';
import { context, get, post, startAPI } from './fixtures/helpers';
import { UserDetails } from '../src/modules/users/users.models';

/*
 ** Start API
 */
ava.before('Start API', async () => {
	await startAPI();
});

/*
 ** Information routes
 */
ava.serial('GET / => n9-node-microservice-skeleton', async (t: ExecutionContext) => {
	const { body, stdout, stderr } = await get<string>('/', 'text');
	t.is(body, 'n9-node-microservice-skeleton');
	t.is(stderr.length, 0, `Request has errors: ${JSON.stringify(stderr)}`);
	t.true(stdout.length > 0, 'Request had no success message');
	t.true(stdout.join('\n').includes('"path":"/"'));
});

ava.serial('GET /ping => pong-db', async (t: ExecutionContext) => {
	const { body, stdout, stderr } = await get<string>('/ping', 'text');
	t.true(body.includes('pong-db'));
	t.is(stderr.length, 0, `Request has errors: ${JSON.stringify(stderr)}`);
	t.not(stdout.length, 0, 'Request had no success message');
	t.true(stdout.length > 0, 'Request had no success message');
	t.true(stdout.join('\n').includes('"path":"/ping"'));
});

ava('GET /routes => 1 routes', async (t: ExecutionContext) => {
	const { body } = await get<any[]>('/routes');
	t.is(body.length, 1);
});

ava.serial('GET /404 => 404 status code', async (t: ExecutionContext) => {
	const { err } = await get('/404');
	t.is(err.status, 404);
	t.is(err.message, 'not-found');
	t.is(err.context.srcError.context.url, '/404');
});

/*
 ** modules/users/
 */
ava('POST /users => 200 with good params', async (t: ExecutionContext) => {
	const { body, err } = await post<UserDetails>('/users', {
		firstName: 'Neo',
		lastName: 'Nine',
		email: 'neo@neo9.fr',
		password: 'password-long',
	});
	t.falsy(err, 'Error is empty');
	t.regex(body._id, /^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i, 'Good _id format');
	t.is(body.firstName, 'Neo');
	t.is(body.lastName, 'Nine');
	t.is(body.email, 'neo@neo9.fr');
	t.falsy(body.password);
	// Add to context
	context.user = body;
	context.session = JSON.stringify({
		userId: body._id,
	});
});

ava('POST /users => 400 with wrong params', async (t: ExecutionContext) => {
	const { err } = await post<UserDetails>('/users', {
		firstName: 'Neo',
		email: 'newameil' + new Date().getTime() + '@test.com',
		password: 'azerty',
	});
	t.is(err.status, 400, 'validate wrong => 400');
	t.is(err.context.srcError.code, 'BadRequestError', 'body code : BadRequestError');
});

ava('POST /users => 409 with user already exists', async (t: ExecutionContext) => {
	const { err } = await post('/users', {
		firstName: 'Neo',
		lastName: 'Nine',
		email: 'neo@neo9.fr',
		password: 'password-long',
	});
	t.is(err.status, 409);
	t.is(err.context.srcError.code, 'user-already-exists');
});

/*
 ** modules/users/
 */
ava('GET /users/:id => 404 with user not found', async (t: ExecutionContext) => {
	const headers = { session: context.session };
	const { err } = await get('/users/012345678901234567890123', 'json', {}, headers);
	t.is(err.status, 404);
	t.is(err.context.srcError.code, 'user-not-found');
});

ava('GET /users/:id => 200 with user found', async (t: ExecutionContext) => {
	const headers = { session: context.session };
	const { body } = await get<UserDetails>(`/users/${context.user._id}`, 'json', {}, headers);
	t.is(body.email, context.user.email);
});

/*
 ** Stop API
 */
ava.after('Stop server', async () => {
	await cb(context.server.close.bind(context.server));
});
