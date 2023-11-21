import {
  IBooleanSchema,
  INumberSchema,
  IStringSchema,
  IValidationSchema,
  ValidationSchemaTypes,
} from '../types/validation';

const emailRegex =
  /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const validateByType = (value: any, schema: ValidationSchemaTypes) => {
  const validators = {
    string: stringChecker,
    email: emailChecker,
    number: numberChecker,
    boolean: booleanChecker,
  };

  const validator = validators[schema.type];
  if (typeof validator === 'function') {
    return validator(value, schema as never);
  }

  return typeof value === schema.type;
};

const booleanChecker = (value: any, schema: IBooleanSchema) => {
  if (value === true || value === false) return;
  return 'value should be boolean';
};

const stringChecker = (value: any, schema: IStringSchema) => {
  if (schema.required && !value) {
    return 'value is required';
  }

  if (typeof value !== 'string') {
    return 'string type should be used for this field';
  }

  if (typeof schema.maxLength === 'number' && value.length > schema.maxLength) {
    return `max length is ${schema.maxLength} symbols`;
  }

  if (typeof schema.minLength === 'number' && value.length < schema.minLength) {
    return `min length is ${schema.minLength} symbols`;
  }

  if (schema.includes && !schema.includes.includes(value)) {
    return `value should be ${schema.includes.join(' or ')}`;
  }

  if (schema.num && !/\d/.test(value)) {
    return 'value should include at least one number';
  }
};

const numberChecker = (value: any, schema: INumberSchema) => {
  if (typeof value !== 'number') {
    return 'number type should be used for this field';
  }

  if (schema.required && !(!Math.abs(value) || value !== 0)) {
    return 'value is required';
  }

  if (typeof schema.maxValue === 'number' && value > schema.maxValue) {
    return `max value is ${schema.maxValue}`;
  }

  if (typeof schema.minValue === 'number' && value < schema.minValue) {
    return `min value is ${schema.minValue}`;
  }
};

const emailChecker = (value: any, schema: IStringSchema) => {
  if (schema.required && !value) {
    return 'value is required';
  }

  if (!value.match(emailRegex)) {
    return 'value is not valid';
  }
};

const validateObject = (obj: object, schema: IValidationSchema): string[] => {
  const errors = Object.keys(schema).reduce((result: any[], key: string) => {
    const schemaForValidation = schema[key];
    const valueForValidation: any = obj[key];
    // skip validation for not required fields if value does not exist
    if (!(valueForValidation === undefined && !schemaForValidation.required)) {
      const validationError = validateByType(obj[key], schemaForValidation);
      if (validationError) {
        result.push(`${key}: ${validationError}`);
      }
    }
    return result;
  }, []);
  return errors;
};

export { validateObject };
