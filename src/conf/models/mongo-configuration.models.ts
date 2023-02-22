import type { MongoClientOptions } from 'mongodb';
import { IsOptional, IsString, Type, ValidateNested } from 'n9-node-routing';

import { MongoClientOptionsImplementation } from './implementations/mongo-implementation.models';

export class MongoConfiguration {
	@IsString()
	url: string;

	@IsOptional()
	@ValidateNested()
	@Type(() => MongoClientOptionsImplementation)
	options?: MongoClientOptions;
}
