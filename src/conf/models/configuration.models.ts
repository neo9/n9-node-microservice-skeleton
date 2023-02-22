import { N9NodeRouting, Type, ValidateNested } from 'n9-node-routing';

import { ApisConfiguration } from './apis-configuration.models';
import { MongoConfiguration } from './mongo-configuration.models';

export class Configuration extends N9NodeRouting.N9NodeRoutingBaseConf {
	@ValidateNested()
	@Type(() => MongoConfiguration)
	mongo: MongoConfiguration;

	@ValidateNested()
	@Type(() => ApisConfiguration)
	apis: ApisConfiguration;
}
