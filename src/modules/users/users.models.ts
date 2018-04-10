import { IsString , MinLength, IsEmail} from "class-validator";
import { Exclude } from "class-transformer";

export class User {
	@Exclude()
	public _id: string;

	@IsString()
	@MinLength(2)
	public firstName: string;

	@IsString()
	@MinLength(2)
	public lastName: string;

	@IsString()
	@IsEmail()
	public email: string;

	@IsString()
	@MinLength(8)
	public password: string;

	@Exclude()
	public createdAt: Date;
}
