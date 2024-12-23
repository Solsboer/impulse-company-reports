import { registerDecorator, ValidationOptions, ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';

@ValidatorConstraint({ name: 'isBeforeDate', async: false })
export class IsBeforeDateConstraint implements ValidatorConstraintInterface {
  validate(propertyValue: string, args: ValidationArguments) {
    const [relatedPropertyName] = args.constraints;
    const relatedValue = (args.object as any)[relatedPropertyName];
    
    if (!propertyValue || !relatedValue) return true;
    
    const startDate = new Date(propertyValue);
    const endDate = new Date(relatedValue);
    
    return startDate < endDate;
  }

  defaultMessage(args: ValidationArguments) {
    const [relatedPropertyName] = args.constraints;
    return `${args.property} must be before ${relatedPropertyName}`;
  }
}

@ValidatorConstraint({ name: 'isNotFutureDate', async: false })
export class IsNotFutureDateConstraint implements ValidatorConstraintInterface {
  validate(propertyValue: string) {
    if (!propertyValue) return true;
    
    const inputDate = new Date(propertyValue);
    const now = new Date();
    
    // Set both dates to the end of their respective days (23:59:59.999)
    const endOfInputDay = new Date(inputDate.getFullYear(), inputDate.getMonth(), inputDate.getDate(), 23, 59, 59, 999);
    const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
    
    return endOfInputDay <= endOfToday;
  }

  defaultMessage() {
    return 'Date cannot be in the future (current day is allowed)';
  }
}

@ValidatorConstraint({ name: 'isWithinMaxRange', async: false })
export class IsWithinMaxRangeConstraint implements ValidatorConstraintInterface {
  validate(propertyValue: string, args: ValidationArguments) {
    const [relatedPropertyName, maxDays] = args.constraints;
    const relatedValue = (args.object as any)[relatedPropertyName];
    
    if (!propertyValue || !relatedValue) return true;
    
    const startDate = new Date(propertyValue);
    const endDate = new Date(relatedValue);
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays <= maxDays;
  }

  defaultMessage(args: ValidationArguments) {
    const [_, maxDays] = args.constraints;
    return `Date range cannot exceed ${maxDays} days`;
  }
}

export function IsBeforeDate(property: string, validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [property],
      validator: IsBeforeDateConstraint,
    });
  };
}

export function IsNotFutureDate(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: IsNotFutureDateConstraint,
    });
  };
}

export function IsWithinMaxRange(property: string, maxDays: number, validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [property, maxDays],
      validator: IsWithinMaxRangeConstraint,
    });
  };
} 