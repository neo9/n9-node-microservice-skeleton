import * as crypto from 'crypto';
import { Collection, FindOneOptions } from 'mongodb';
import { Service } from "typedi";
import { mapObjectToClass, oid } from '../../mongo';
import { User } from './users.models';

@Service()
export class UsersService {

	private usersCollection: Collection = global.db.collection('users');

	public async getById(userId: string): Promise<User> {
		return await this.findOne({ _id: oid(userId) });
	}

	public async getByEmail(email: string): Promise<User> {
		return await this.findOne({ email });
	}

	public async findOne(query: object, options?: FindOneOptions): Promise<User> {
		return mapObjectToClass(User, await this.usersCollection.findOne(query, options));
	}

	public async create(user: User): Promise<User> {
		// Hash password
		user.password = await this.hashPassword(user.password);
		// Add date creation
		user.createdAt = new Date();
		// Save to database
		await this.usersCollection.insertOne(user);
		// Send back user
		return mapObjectToClass(User, user);
	}

	private async hashPassword(password: string): Promise<string> {
		const hasher = crypto.createHash('sha256');
		await hasher.update(password);
		return hasher.digest('hex');
	}
}
