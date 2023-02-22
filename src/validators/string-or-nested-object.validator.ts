// eslint-disable-next-line import/no-extraneous-dependencies
import * as ClassValidator from 'class-validator';

@ClassValidator.ValidatorConstraint({ name: 'isStringOrNestedObject', async: false })
export class IsStringOrNestedObject implements ClassValidator.ValidatorConstraintInterface {
	public validate(value: Record<string | number, unknown>): boolean {
		for (const recordValue of Object.values(value)) {
			if (!ClassValidator.isObject(recordValue)) return false;
			const errors = ClassValidator.validateSync(recordValue);
			if (errors.length) {
				return false;
			}
		}
		return true;
	}

	public defaultMessage(): string {
		return `Value should be a string or a valid object`;
	}
}

export function isStringOrNestedObject(
	validationOptions?: ClassValidator.ValidationOptions,
): (object: object, propertyName: string) => void {
	return (object: object, propertyName: string): void => {
		ClassValidator.registerDecorator({
			propertyName,
			target: object.constructor,
			options: validationOptions,
			constraints: [],
			validator: new IsStringOrNestedObject(),
		});
	};
}
