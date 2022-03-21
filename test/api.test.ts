/* eslint-disable simple-import-sort/imports,import/order */
import { context, get, post, startAPI, stopAPI } from './fixtures/helpers';
import ava, { Assertions } from 'ava';
import { UserListItem, UserDetails, UserRequestCreate } from '../src/modules/users/users.models';
import { N9JSONStreamResponse } from '@neo9/n9-node-utils';

/*
 ** Start API
 */
ava.before('Start API', async () => {
	await startAPI({}, true);
});

/*
 ** Information routes
 */
ava.serial('GET / => n9-node-microservice-skeleton', async (t: Assertions) => {
	const { body, stdout, stderr } = await get<string>('/', 'text');
	t.is(body, 'n9-node-microservice-skeleton');
	t.is(stderr.length, 0, `Request has errors: ${JSON.stringify(stderr)}`);
	t.true(stdout.length > 0, 'Request had no success message');
	t.true(stdout.join('\n').includes(' GET / 200 '));
});

ava.serial('GET /ping => pong-db', async (t: Assertions) => {
	const { body, stdout, stderr } = await get<string>('/ping', 'text');
	t.true(body.includes('pong-db'));
	t.is(stderr.length, 0, `Request has errors: ${JSON.stringify(stderr)}`);
	t.not(stdout.length, 0, 'Request had no success message');
	t.true(stdout.length > 0, 'Request had no success message');
	t.true(stdout.join('\n').includes(' GET /ping 200 '));
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

/*
 ** modules/users/
 */
ava('POST /users => 200 with good params', async (t: Assertions) => {
	const { body, err } = await post<UserRequestCreate, UserDetails>('/users', {
		firstName: 'Neo',
		lastName: 'Nine',
		email: 'neo@neo9.fr',
		password: 'password-long',
		someData: undefined,
	});
	t.falsy(err, 'Error is empty');
	t.regex(body._id, /^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i, 'Good _id format');
	t.is(body.firstName, 'Neo');
	t.is(body.lastName, 'Nine');
	t.is(body.email, 'neo@neo9.fr');
	t.is(body.password, undefined);
	// Add to context
	context.user = body;
	context.session = JSON.stringify({
		userId: body._id,
	});
});

ava('POST /users => 400 with wrong params', async (t: Assertions) => {
	const { err } = await post<Partial<UserRequestCreate>, UserDetails>('/users', {
		firstName: 'Neo',
		email: `newameil${new Date().getTime()}@test.com`,
		password: 'azerty',
	});
	t.is(err.status, 400, 'validate wrong => 400');
	t.is(err.context.srcError.code, 'BadRequestError', 'body code : BadRequestError');
});

ava('POST /users => 409 with user already exists', async (t: Assertions) => {
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
ava('GET /users/:id => 404 with user not found', async (t: Assertions) => {
	const headers = { session: context.session };
	const { err } = await get('/users/012345678901234567890123', 'json', {}, headers);
	t.is(err.status, 404);
	t.is(err.context.srcError.code, 'user-not-found');
});

ava('GET /users/:id => 200 with user found', async (t: Assertions) => {
	const headers = { session: context.session };
	const { body } = await get<UserDetails>(`/users/${context.user._id}`, 'json', {}, headers);
	t.is(body.email, context.user.email);
});

ava('GET /users => 200 with 10 users', async (t: Assertions) => {
	const headers = { session: context.session };
	const { body } = await get<N9JSONStreamResponse<UserListItem>>(`/users`, 'json', {}, headers);
	t.is(body.count, 10);
	t.is((body.items[0] as UserDetails).password, undefined, 'password is not in the userListItem');
});

ava('GET /users => 400 with page size too big', async (t: Assertions) => {
	const headers = { session: context.session };
	const { err } = await get<N9JSONStreamResponse<UserListItem>>(
		`/users`,
		'json',
		{ size: 500 },
		headers,
	);
	t.is(err.status, 400);
});

/*
 ** Stop API
 */
ava.after('Stop server', async () => {
	await stopAPI();
});
