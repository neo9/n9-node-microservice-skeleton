import type { Response } from 'express';
import {
	Acl,
	Authorized,
	Body,
	Get,
	Inject,
	JsonController,
	N9Error,
	N9JSONStream,
	N9Log,
	OpenAPI,
	Param,
	Post,
	QueryParam,
	QueryParams,
	Res,
	Service,
	Session,
} from 'n9-node-routing';

import { SizeValidation } from '../../models/size-validation.models';
import { TokenContent } from '../../models/token-content.models';
import { UserDetails, UserListItem, UserRequestCreate } from './users.models';
import { UsersService } from './users.service';

@Service()
@JsonController('/users')
export class UsersController {
	@Inject('logger')
	private logger: N9Log;

	@Inject('conf')
	private conf: any;

	constructor(private usersService: UsersService) {}

	@OpenAPI({
		description: 'Create one user',
		responses: {
			// eslint-disable-next-line @typescript-eslint/naming-convention
			400: {
				description: 'Bad Request',
			},
			// eslint-disable-next-line @typescript-eslint/naming-convention
			409: {
				description: 'User email already exist',
			},
		},
	})
	@Acl([{ action: 'createUser' }])
	@Post()
	public async createUser(
		@Session({ required: false }) session: TokenContent,
		@Body() user: UserRequestCreate,
	): Promise<UserDetails> {
		user.email = user.email.toLowerCase();
		const userExists = await this.usersService.existsByEmail(user.email);

		if (userExists) {
			throw new N9Error('user-already-exists', 409);
		}

		const userMongo = await this.usersService.create(
			user,
			session ? session.userId : 'no-auth-user',
		);

		delete userMongo.password;
		return userMongo;
	}

	@Authorized()
	@Get('/:id')
	public async getUserById(@Param('id') userId: string): Promise<UserDetails> {
		const user = await this.usersService.getById(userId);
		if (!user) {
			throw new N9Error('user-not-found', 404);
		}
		return user;
	}

	@Get('/')
	public async getUsers(
		@QueryParams() qp: SizeValidation,
		@Res() res: Response,
		@QueryParam('page') page: number = 0,
		@QueryParam('size') size: number = 10,
	): Promise<N9JSONStream<UserListItem>> {
		const users = this.usersService.find({}, page, size);
		return users.pipe(
			new N9JSONStream({
				res,
				total: await users.count(),
			}),
		);
	}
}
