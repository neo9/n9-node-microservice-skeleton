// eslint-disable-next-line import/no-extraneous-dependencies
import * as ClassValidator from 'class-validator';

@ClassValidator.ValidatorConstraint({ name: 'isStringOrBuffer', async: false })
export class IsStringOrBuffer implements ClassValidator.ValidatorConstraintInterface {
	public validate(value: unknown): boolean {
		return ClassValidator.isString(value) || ClassValidator.isInstance(value, Buffer);
	}

	public defaultMessage(): string {
		return 'Value should be a string or a buffer';
	}
}

export function isStringOrBuffer(
	validationOptions?: ClassValidator.ValidationOptions,
): (object: object, propertyName: string) => void {
	return (object: object, propertyName: string): void => {
		ClassValidator.registerDecorator({
			propertyName,
			target: object.constructor,
			options: validationOptions,
			constraints: [],
			validator: new IsStringOrBuffer(),
		});
	};
}
