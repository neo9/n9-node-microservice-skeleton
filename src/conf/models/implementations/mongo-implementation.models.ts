/* eslint-disable max-classes-per-file */
import { EventEmitter } from 'events';
import type {
	AutoEncryptionExtraOptions,
	AutoEncryptionOptions,
	ClientSession,
	KMSProviders,
	MongoClient,
	MongoClientOptions,
	ReadConcern,
	ReadPreferenceOrMode,
	ReadPreferenceTags,
	SocketOptions,
} from 'mongodb';
import {
	Allow,
	IsArray,
	IsBoolean,
	IsIn,
	IsInstance,
	IsInt,
	IsObject,
	IsOptional,
	IsPositive,
	IsString,
	isStringOrNumber,
	Min,
	Type,
	ValidateNested,
} from 'n9-node-routing';
import { PeerCertificate } from 'tls';

import { isObjectOrBoolean } from '../../../validators/object-or-boolean.validator';
import { isStringOrBuffer } from '../../../validators/string-or-buffer.validator';
import { isStringOrNestedObject } from '../../../validators/string-or-nested-object.validator';

export class MongoAutoEncryptionExtraOptionsImplementation implements AutoEncryptionExtraOptions {
	@IsOptional()
	@IsBoolean()
	mongocryptdBypassSpawn?: boolean;

	@IsOptional()
	@IsArray()
	@IsString({ each: true })
	mongocryptdSpawnArgs?: string[];

	@IsOptional()
	@IsString()
	mongocryptdSpawnPath?: string;

	@IsOptional()
	@IsString()
	mongocryptdURI?: string;
}

export class MongoAwsKMSProvidersImplementation {
	@IsOptional()
	@IsString()
	accessKeyId?: string;

	@IsOptional()
	@IsString()
	secretAccessKey?: string;
}

export class MongoGcpKMSProvidersImplementation {
	@IsOptional()
	@IsString()
	email?: string;

	@IsOptional()
	@isStringOrBuffer()
	privateKey?: string | Buffer;

	@IsOptional()
	@IsString()
	endpoint?: string;
}

export class MongoLocalKMSProvidersImplementation {
	@IsOptional()
	@IsInstance(Buffer)
	key?: Buffer;
}

export class MongoKMSProvidersImplementation implements KMSProviders {
	@IsOptional()
	@ValidateNested()
	@Type(() => MongoAwsKMSProvidersImplementation)
	aws?: MongoAwsKMSProvidersImplementation;

	@IsOptional()
	@ValidateNested()
	@Type(() => MongoGcpKMSProvidersImplementation)
	gcp?: MongoGcpKMSProvidersImplementation;

	@IsOptional()
	@ValidateNested()
	@Type(() => MongoLocalKMSProvidersImplementation)
	kms?: MongoLocalKMSProvidersImplementation;
}

export class MongoReadConcernImplementation implements ReadConcern {
	@IsIn(['local', 'majority', 'linearizable', 'available', 'snapshot'])
	level: 'local' | 'majority' | 'linearizable' | 'available' | 'snapshot';
}

export class MongoAutoEncryptionOptionsImplementation implements AutoEncryptionOptions {
	@IsOptional()
	@IsBoolean()
	bypassAutoEncryption?: boolean;

	@IsOptional()
	@ValidateNested()
	@Type(() => MongoAutoEncryptionExtraOptionsImplementation)
	extraOptions?: MongoAutoEncryptionExtraOptionsImplementation;

	@IsOptional()
	@IsInstance(EventEmitter)
	keyVaultClient?: MongoClient;

	@IsOptional()
	@IsString()
	keyVaultNamespace?: string;

	@IsOptional()
	@ValidateNested()
	@Type(() => MongoKMSProvidersImplementation)
	kmsProviders?: MongoKMSProvidersImplementation;

	@IsOptional()
	@IsObject()
	schemaMap?: object;
}

class MongoSocketOptionsImplementation implements SocketOptions {
	@IsOptional()
	@IsBoolean()
	autoReconnect?: boolean;

	@IsOptional()
	@IsInt()
	@IsPositive()
	connectTimeoutMS?: number;

	@IsOptional()
	@IsIn([4, 6])
	family?: 4 | 6 | null;

	@IsOptional()
	@IsBoolean()
	keepAlive?: boolean;

	@IsOptional()
	@IsInt()
	@IsPositive()
	keepAliveInitialDelay?: number;

	@IsOptional()
	@IsBoolean()
	noDelay?: boolean;

	@IsOptional()
	@IsInt()
	@IsPositive()
	socketTimeoutMS?: number;
}

class MongoWriteConcernImplementation {
	@IsOptional()
	@isStringOrNumber()
	w?: number | 'majority' | string;

	@IsOptional()
	@IsBoolean()
	j?: boolean;

	@IsOptional()
	@IsInt()
	@IsPositive()
	wtimeout?: number;
}
export class MongoClientOptionsAuthImplementation {
	@IsString()
	user: string;

	@IsString()
	password: string;
}

export class MongoClientOptionsCompressionImplementation {
	@IsOptional()
	@IsArray()
	@IsIn(['snappy', 'zlib'], { each: true })
	compressors?: ('snappy' | 'zlib')[];
}

export class MongoClientOptionsImplementation implements MongoClientOptions {
	@IsOptional()
	@IsInt()
	@IsPositive()
	acceptableLatencyMS?: number;

	@IsOptional()
	@IsString()
	appname?: string;

	@IsOptional()
	@ValidateNested()
	@Type(() => MongoClientOptionsAuthImplementation)
	auth?: MongoClientOptionsAuthImplementation;

	@IsOptional()
	@IsString()
	authMechanism?:
		| 'DEFAULT'
		| 'GSSAPI'
		| 'PLAIN'
		| 'MONGODB-X509'
		| 'MONGODB-CR'
		| 'MONGODB-AWS'
		| 'SCRAM-SHA-1'
		| 'SCRAM-SHA-256'
		| string;

	@IsOptional()
	@IsString()
	authSource?: string;

	@IsOptional()
	@ValidateNested()
	@Type(() => MongoAutoEncryptionOptionsImplementation)
	autoEncryption?: MongoAutoEncryptionOptionsImplementation;

	@IsOptional()
	@IsBoolean()
	autoReconnect?: boolean;

	@IsOptional()
	@IsInt()
	@IsPositive()
	bufferMaxEntries?: number;

	@IsOptional()
	@IsBoolean()
	checkServerIdentity?: boolean | ((hostname: string, cert: PeerCertificate) => Error | undefined);

	@IsOptional()
	@IsString()
	ciphers?: string;

	@IsOptional()
	@ValidateNested()
	@Type(() => MongoClientOptionsCompressionImplementation)
	compression?: MongoClientOptionsCompressionImplementation;

	@IsOptional()
	@IsInt()
	@IsPositive()
	connectTimeoutMS?: number;

	@IsOptional()
	@IsBoolean()
	connectWithNoPrimary?: boolean;

	@IsOptional()
	@IsBoolean()
	directConnection?: boolean;

	@IsOptional()
	@IsBoolean()
	domainsEnabled?: boolean;

	@IsOptional()
	@IsString()
	ecdhCurve?: string;

	@IsOptional()
	@IsIn([4, 6])
	family?: 4 | 6 | null;

	@IsOptional()
	@IsBoolean()
	forceServerObjectId?: boolean;

	@IsOptional()
	@IsBoolean()
	fsync?: boolean;

	@IsOptional()
	@IsBoolean()
	ha?: boolean;

	@IsOptional()
	@IsInt()
	@IsPositive()
	haInterval?: number;

	@IsOptional()
	@IsInt()
	@IsPositive()
	heartbeatFrequencyMS?: number;

	@IsOptional()
	@IsBoolean()
	ignoreUndefined?: boolean;

	@IsOptional()
	@IsBoolean()
	j?: boolean;

	@IsOptional()
	@IsBoolean()
	keepAlive?: boolean;

	@IsOptional()
	@IsInt()
	@IsPositive()
	keepAliveInitialDelay?: number;

	@IsOptional()
	@IsInt()
	@IsPositive()
	localThresholdMS?: number;

	@IsOptional()
	@IsObject()
	logger?: object | ((message?: string, state?: unknown) => void);

	@IsOptional()
	@IsIn(['error', 'warn', 'info', 'debug'])
	loggerLevel?: 'error' | 'warn' | 'info' | 'debug';

	@IsOptional()
	@IsInt()
	@IsPositive()
	maxIdleTimeMS?: number;

	@IsOptional()
	@IsInt()
	@IsPositive()
	maxPoolSize?: number;

	@IsOptional()
	@IsInt()
	@IsPositive()
	maxStalenessSeconds?: number;

	@IsOptional()
	@IsInt()
	@IsPositive()
	minPoolSize?: number;

	@IsOptional()
	@IsInt()
	@IsPositive()
	minSize?: number;

	@IsOptional()
	@IsBoolean()
	monitorCommands?: boolean;

	@IsOptional()
	@IsBoolean()
	monitoring?: boolean;

	@IsOptional()
	@IsBoolean()
	// eslint-disable-next-line @typescript-eslint/naming-convention
	native_parser?: boolean;

	@IsOptional()
	@IsBoolean()
	noDelay?: boolean;

	@IsOptional()
	@IsInt()
	@Min(0)
	numberOfRetries?: number;

	@IsOptional()
	@IsObject()
	pkFactory?: object;

	@IsOptional()
	@IsInt()
	@IsPositive()
	poolSize?: number;

	@IsOptional()
	@IsObject()
	promiseLibrary?: PromiseConstructor;

	@IsOptional()
	@IsBoolean()
	promoteBuffers?: boolean;

	@IsOptional()
	@IsBoolean()
	promoteLongs?: boolean;

	@IsOptional()
	@IsBoolean()
	promoteValues?: boolean;

	@IsOptional()
	@IsBoolean()
	raw?: boolean;

	@IsOptional()
	@isStringOrNestedObject()
	@Type(() => MongoReadConcernImplementation)
	readConcern?: MongoReadConcernImplementation | string; // todo: find a way to allow string

	@IsOptional()
	@Allow()
	readPreference?: ReadPreferenceOrMode;

	@IsOptional()
	@IsArray()
	@IsObject({ each: true })
	readPreferenceTags?: ReadPreferenceTags;

	@IsOptional()
	@IsInt()
	@IsPositive()
	reconnectInterval?: number;

	@IsOptional()
	@IsInt()
	@Min(0)
	reconnectTries?: number;

	@IsOptional()
	@IsString()
	replicaSet?: string;

	@IsOptional()
	@IsInt()
	@IsPositive()
	secondaryAcceptableLatencyMS?: number;

	@IsOptional()
	@IsBoolean()
	serializeFunctions?: boolean;

	@IsOptional()
	@IsInt()
	@IsPositive()
	serverSelectionTimeoutMS?: number;

	@IsOptional()
	@IsString()
	servername?: string;

	@IsOptional()
	@IsInstance(EventEmitter)
	session?: ClientSession;

	@IsOptional()
	@ValidateNested()
	@Type(() => MongoSocketOptionsImplementation)
	socketOptions?: MongoSocketOptionsImplementation;

	@IsOptional()
	@IsInt()
	@IsPositive()
	socketTimeoutMS?: number;

	@IsOptional()
	@IsBoolean()
	ssl?: boolean;

	@IsOptional()
	@IsArray()
	@isStringOrBuffer({ each: true })
	sslCA?: readonly (Buffer | string)[];

	@IsOptional()
	@IsArray()
	@isStringOrBuffer({ each: true })
	sslCRL?: readonly (Buffer | string)[];

	@IsOptional()
	@isStringOrBuffer()
	sslCert?: Buffer | string;

	@IsOptional()
	@isStringOrBuffer()
	sslKey?: Buffer | string;

	@IsOptional()
	@isStringOrBuffer()
	sslPass?: Buffer | string;

	@IsOptional()
	@IsBoolean()
	sslValidate?: boolean;

	@IsOptional()
	@IsBoolean()
	tls?: boolean;

	@IsOptional()
	@IsBoolean()
	tlsAllowInvalidCertificates?: boolean;

	@IsOptional()
	@IsBoolean()
	tlsAllowInvalidHostnames?: boolean;

	@IsOptional()
	@IsString()
	tlsCAFile?: string;

	@IsOptional()
	@IsString()
	tlsCertificateKeyFile?: string;

	@IsOptional()
	@IsString()
	tlsCertificateKeyFilePassword?: string;

	@IsOptional()
	@IsBoolean()
	tlsInsecure?: boolean;

	@IsOptional()
	@IsBoolean()
	useNewUrlParser?: boolean;

	@IsOptional()
	@IsBoolean()
	useUnifiedTopology?: boolean;

	@IsOptional()
	@isObjectOrBoolean()
	validateOptions?: object | boolean;

	@IsOptional()
	@isStringOrNumber()
	w?: number | 'majority' | string;

	@IsOptional()
	@IsInt()
	@IsPositive()
	waitQueueTimeoutMS?: number;

	@IsOptional()
	@isStringOrNestedObject()
	@Type(() => MongoWriteConcernImplementation)
	writeConcern?: MongoWriteConcernImplementation | string;

	@IsOptional()
	@IsInt()
	@IsPositive()
	wtimeout?: number;
}
