import {
	isInstance,
	isString,
	registerDecorator,
	ValidationOptions,
	ValidatorConstraint,
	ValidatorConstraintInterface,
} from 'n9-node-routing';

@ValidatorConstraint({ name: 'isStringOrBuffer', async: false })
export class IsStringOrBuffer implements ValidatorConstraintInterface {
	public validate(value: unknown): boolean {
		return isString(value) || isInstance(value, Buffer);
	}

	public defaultMessage(): string {
		return 'Value should be a string or a buffer';
	}
}

export function isStringOrBuffer(
	validationOptions?: ValidationOptions,
): (object: object, propertyName: string) => void {
	return (object: object, propertyName: string): void => {
		registerDecorator({
			propertyName,
			target: object.constructor,
			options: validationOptions,
			constraints: [],
			validator: new IsStringOrBuffer(),
		});
	};
}
