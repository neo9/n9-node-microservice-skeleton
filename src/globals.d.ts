import type { Db, MongoClient } from 'mongodb';
import { N9Log } from 'n9-node-routing';

import { Configuration } from './conf/models/configuration.models';

/* eslint-disable no-var,vars-on-top */
declare global {
	var conf: Configuration;
	var log: N9Log;
	var db: Db;
	var dbClient: MongoClient;
}

export {};
