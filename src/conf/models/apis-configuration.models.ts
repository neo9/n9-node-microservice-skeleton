import { IsInt, IsPositive, IsString, Type, ValidateNested } from 'n9-node-routing';

// todo on init skeleton: Replace or remove this example (need to update ../application.ts with new models)
export class MyApiName1Configuration {
	@IsString()
	url: string;

	@IsInt()
	@IsPositive()
	cacheDuration: number;
}
export class MyApiName2Configuration {
	@IsString()
	url: string;

	@IsInt()
	@IsPositive()
	bulkSize: number;
}

export class ApisConfiguration {
	@ValidateNested()
	@Type(() => MyApiName1Configuration)
	myApiName1: MyApiName1Configuration;

	@ValidateNested()
	@Type(() => MyApiName2Configuration)
	myApiName2: MyApiName2Configuration;
}
