import { N9Error } from '@neo9/n9-node-utils';
import { Body, Get, JsonController, Param, Post, Authorized } from "routing-controllers";
import { Service } from "typedi";
import { Acl } from 'routing-controllers-wrapper';
import { User } from './users.models';
import { UsersService } from "./users.service";

@Service()
@JsonController('/users')
export class UsersController {

	constructor(private usersService: UsersService) {
	}

	@Acl([{ action: 'createUser' }])
	@Post()
	public async createUser(@Body() user: User): Promise<User> {

		// sanitize email to lowercase
		user.email = user.email.toLowerCase();
		// Check if user by email already exists
		const userExists = !! await this.usersService.getByEmail(user.email);

		// TODO: move to validation
		if (userExists) {
			throw new N9Error('user-already-exists', 409);
		}

		// Add user to database
		const userMongo = await this.usersService.create(user);
		delete userMongo.password;
		// Send back the user created
		return userMongo;
	}

	@Authorized()
	@Get('/:id')
	public async getUserById(@Param('id') userId: string): Promise<User> {
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
