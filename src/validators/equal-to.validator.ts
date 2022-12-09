import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'EqualTo' })
export class EqualToValidator implements ValidatorConstraintInterface {
  /**
   * @inheritdoc
   *
   * Method to be called to perform custom validation over given value.
   *
   * @param {any}             value
   * @param {ValidationArguments} args
   *
   * @returns {boolean}
   */
  public validate(value: any, args: ValidationArguments): boolean {
    const [relatedPropertyName] = args.constraints;
    const relatedValue = (args.object as any)[relatedPropertyName];
    return value === relatedValue;
  }

  /**
   * @inheritdoc
   *
   * @param {ValidationArguments} args
   *
   * @returns {string}
   */
  /* istanbul ignore next */
  public defaultMessage(args: ValidationArguments): string {
    return `${args.property} must match ${args.constraints[0]} exactly`;
  }
}
