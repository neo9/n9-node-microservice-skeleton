import { ClassTransformOptions, plainToClass } from 'class-transformer';
import * as _ from 'lodash';
import { Db, MongoClient, ObjectID } from 'mongodb';

// tslint:disable-next-line
export type ClassType<T> = {
	new(...args: any[]): T;
};

export default async function(mongo: { url: string }): Promise<Db> {
	const log = global.log.module('mongo');
	log.info(`Connecting to ${mongo.url}...`);
	const db = (await MongoClient.connect(mongo.url)).db();
	log.info(`Connected`);
	return db;
}

export function oid(id: string | ObjectID): ObjectID | null {
	// istanbul ignore next
	return id ? new ObjectID(id) : id as null;
}

export function mapObjectIdToStringHex<T>(obj: any): any {
	Object.keys(obj).forEach((key) => {
		if (obj[key] && typeof obj[key] === 'object' && !(obj[key] instanceof ObjectID)) {
			mapObjectIdToStringHex(obj[key]);
		} else if (obj[key] instanceof ObjectID) {
			obj[key] = (obj[key] as ObjectID).toHexString();
		}
	});
	return obj;
}

export function mapObjectToClass<T extends object, V>(cls: ClassType<T>, plain: V, options?: ClassTransformOptions): T {
	if (!plain) return plain as any;

	const newPlain = mapObjectIdToStringHex(_.cloneDeep(plain));
	return plainToClass(cls, newPlain, options) as T;
}
