import {
    registerDecorator,
    ValidationOptions
} from 'class-validator';

export function IsUserPassword(validationOptions?: ValidationOptions) {
    return function (object: object, propertyName: string) {
        registerDecorator({
            name: 'IsUserPassword',
            target: object.constructor,
            propertyName,
            options: validationOptions,
            validator: {
                validate(value: unknown): boolean {
                    if (typeof value !== 'string') return false;

                    const length = value.length;

                    const hasSymbol = /[^A-Za-z0-9]/.test(value);
                    const hasNumber = /\d/.test(value);
                    const hasUpper = /[A-Z]/.test(value);
                    const hasLower = /[a-z]/.test(value);

                    if (hasSymbol && length < 8) return false;
                    if (hasNumber && length < 16) return false;
                    if (hasUpper && length < 32) return false;
                    if (hasLower && length < 64) return false;
                    if (length > 128) return false;

                    return true;
                }
            }
        });
    };
}
