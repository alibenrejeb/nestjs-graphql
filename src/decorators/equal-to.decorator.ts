import { registerDecorator, ValidationOptions } from 'class-validator';
import { EqualToValidator } from './../validators/equal-to.validator';

/**
 * Decorator
 *
 * @param {ValidationOptions} validationOptions?
 *
 * @returns {Function}
 */
export function EqualTo(
  property: string,
  validationOptions?: ValidationOptions,
): (object: any, propertyName: string) => void {
  return (object: any, propertyName: string): void => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [property],
      validator: EqualToValidator,
    });
  };
}
