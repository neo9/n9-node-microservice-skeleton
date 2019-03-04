import { MongoClient } from '@neo9/n9-mongo-client';
import * as crypto from 'crypto';
import { Service } from 'typedi';
import { User } from './users.models';

@Service()
export class UsersService {
	private mongoClient: MongoClient<User, User>;

	constructor() {
		this.mongoClient = new MongoClient('users', User, User, {
			keepHistoric: true,
		});
	}

	public async getById(userId: string): Promise<User> {
		return await this.mongoClient.findOneById(userId);
	}

	public async getByEmail(email: string): Promise<User> {
		return await this.mongoClient.findOneByKey(email, 'email');
	}

	public async create(user: User, creatorUserId: string): Promise<User> {
		// Hash password
		user.password = await this.hashPassword(user.password);
		// Add date creation
		user.createdAt = new Date();
		// Save to database
		return await this.mongoClient.insertOne(user, creatorUserId);
	}

	private async hashPassword(password: string): Promise<string> {
		const hasher = crypto.createHash('sha256');
		await hasher.update(password);
		return hasher.digest('hex');
	}
}
