import { N9JSONStreamResponse } from '@neo9/n9-node-utils';
import ava, { Assertions } from 'ava';

import { UserDetails, UserListItem, UserRequestCreate } from '../src/modules/users/users.models';
import { context, get, post, startAPI, stopAPI } from './fixtures/helpers';

/*
 ** Start API
 */
ava.before('Start API', async () => {
	await startAPI({}, true);
});

/*
 ** modules/users/
 */
ava.serial('POST /users => 200 with good params', async (t: Assertions) => {
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

ava.serial('POST /users => 400 with wrong params', async (t: Assertions) => {
	const { err } = await post<Partial<UserRequestCreate>, UserDetails>('/users', {
		firstName: 'Neo',
		email: `newameil${new Date().getTime()}@test.com`,
		password: 'azerty',
	});
	t.is(err.status, 400, 'validate wrong => 400');
	t.is(err.context.srcError.code, 'BadRequestError', 'body code : BadRequestError');
});

ava.serial('POST /users => 409 with user already exists', async (t: Assertions) => {
	const { err } = await post('/users', {
		firstName: 'Neo',
		lastName: 'Nine',
		email: 'neo@neo9.fr',
		password: 'password-long',
	});
	t.is(err.status, 409);
	t.is(err.context.srcError.code, 'user-already-exists');
});

ava.serial('GET /users/:id => 404 with user not found', async (t: Assertions) => {
	const headers = { session: context.session };
	const { err } = await get('/users/012345678901234567890123', 'json', {}, headers);
	t.is(err.status, 404);
	t.is(err.context.srcError.code, 'user-not-found');
});

ava.serial('GET /users/:id => 200 with user found', async (t: Assertions) => {
	const headers = { session: context.session };
	const { body } = await get<UserDetails>(`/users/${context.user._id}`, 'json', {}, headers);
	t.is(body.email, context.user.email);
});

ava.serial('GET /users => 200 with 10 users', async (t: Assertions) => {
	const headers = { session: context.session };
	const { body } = await get<N9JSONStreamResponse<UserListItem>>(`/users`, 'json', {}, headers);
	t.is(body.count, 10);
	t.is((body.items[0] as UserDetails).password, undefined, 'password is not in the userListItem');
});

ava.serial('GET /users => 400 with page size too big', async (t: Assertions) => {
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
