// eslint-disable-next-line import/no-extraneous-dependencies
import * as ClassValidator from 'class-validator';

@ClassValidator.ValidatorConstraint({ name: 'isObjectOrBoolean', async: false })
export class IsObjectOrBoolean implements ClassValidator.ValidatorConstraintInterface {
	public validate(value: unknown): boolean {
		return ClassValidator.isObject(value) || ClassValidator.isBoolean(value);
	}

	public defaultMessage(): string {
		return 'Value should be an object or an boolean';
	}
}

export function isObjectOrBoolean(
	validationOptions?: ClassValidator.ValidationOptions,
): (object: object, propertyName: string) => void {
	return (object: object, propertyName: string): void => {
		ClassValidator.registerDecorator({
			propertyName,
			target: object.constructor,
			options: validationOptions,
			constraints: [],
			validator: new IsObjectOrBoolean(),
		});
	};
}
