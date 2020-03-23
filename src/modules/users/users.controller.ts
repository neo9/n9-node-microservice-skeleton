import { N9Error } from '@neo9/n9-node-utils';
import { Acl, OpenAPI } from 'n9-node-routing';
import {
	Authorized,
	Body,
	Get,
	JsonController,
	Param,
	Post,
	Session,
} from '@flyacts/routing-controllers';
import { Service, Inject } from 'typedi';
import { TokenContent } from '../../models/token-content.models';
import { UserRequestCreate, UserDetails } from './users.models';
import { UsersService } from './users.service';
import { N9Log } from '@neo9/n9-node-log';

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
			400: {
				description: 'Bad Request',
			},
			409: {
				desciption: 'User email already exist',
			},
		},
	})
	@Acl([{ action: 'createUser' }])
	@Post()
	public async createUser(
		@Session({ required: false }) session: TokenContent,
		@Body() user: UserRequestCreate,
	): Promise<UserDetails> {
		// sanitize email to lowercase
		user.email = user.email.toLowerCase();
		// Check if user by email already exists
		const userExists = !!(await this.usersService.getByEmail(user.email));

		// TODO: move to validation
		if (userExists) {
			throw new N9Error('user-already-exists', 409);
		}

		// Add user to database
		const userMongo = await this.usersService.create(
			user,
			session ? session.userId : 'no-auth-user',
		);

		delete userMongo.password;
		// Send back the user created
		return userMongo;
	}

	@Authorized()
	@Get('/:id')
	public async getUserById(@Param('id') userId: string): Promise<UserDetails> {
		// Check if user exists
		const user = await this.usersService.getById(userId);
		if (!user) {
			throw new N9Error('user-not-found', 404);
		}
		delete user.password;
		// Send back the user
		return user;
	}
}
