import {
	isBoolean,
	isObject,
	registerDecorator,
	ValidationOptions,
	ValidatorConstraint,
	ValidatorConstraintInterface,
} from 'n9-node-routing';

@ValidatorConstraint({ name: 'isObjectOrBoolean', async: false })
export class IsObjectOrBoolean implements ValidatorConstraintInterface {
	public validate(value: unknown): boolean {
		return isObject(value) || isBoolean(value);
	}

	public defaultMessage(): string {
		return 'Value should be an object or an boolean';
	}
}

export function isObjectOrBoolean(
	validationOptions?: ValidationOptions,
): (object: object, propertyName: string) => void {
	return (object: object, propertyName: string): void => {
		registerDecorator({
			propertyName,
			target: object.constructor,
			options: validationOptions,
			constraints: [],
			validator: new IsObjectOrBoolean(),
		});
	};
}
