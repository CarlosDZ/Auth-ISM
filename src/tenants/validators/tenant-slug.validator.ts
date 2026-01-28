import { registerDecorator, ValidationOptions } from 'class-validator';

export function IsTenantSlug(validationOptions?: ValidationOptions) {
    return function (object: object, propertyName: string) {
        registerDecorator({
            name: 'IsTenantSlug',
            target: object.constructor,
            propertyName,
            options: validationOptions,
            validator: {
                validate(value: unknown): boolean {
                    if (typeof value !== 'string') return false;

                    if (!/^[a-z0-9-]+$/.test(value)) return false;

                    if (value.length > 64) return false;

                    return true;
                }
            }
        });
    };
}
