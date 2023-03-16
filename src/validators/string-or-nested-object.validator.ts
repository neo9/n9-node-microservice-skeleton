import {
	isObject,
	registerDecorator,
	validateSync,
	ValidationOptions,
	ValidatorConstraint,
	ValidatorConstraintInterface,
} from 'n9-node-routing';

@ValidatorConstraint({ name: 'isStringOrNestedObject', async: false })
export class IsStringOrNestedObject implements ValidatorConstraintInterface {
	public validate(value: unknown): boolean {
		if (typeof value === 'string') return true;
		if (!isObject(value)) return false;
		const errors = validateSync(value);
		return errors.length === 0;
	}

	public defaultMessage(): string {
		return `Value should be a string or a valid object`;
	}
}

export function isStringOrNestedObject(
	validationOptions?: ValidationOptions,
): (object: object, propertyName: string) => void {
	return (object: object, propertyName: string): void => {
		registerDecorator({
			propertyName,
			target: object.constructor,
			options: validationOptions,
			constraints: [],
			validator: new IsStringOrNestedObject(),
		});
	};
}
