interface IValidationSchema {
  [key: string]: ValidationSchemaTypes;
}

type ValidationSchemaTypes =
  | IStringSchema
  | IEmailSchema
  | INumberSchema
  | IBooleanSchema;

interface IBasicSchema<T> {
  type: T;
  required: boolean;
}

interface IStringSchema extends IBasicSchema<'string'> {
  minLength?: number;
  maxLength?: number;
  includes?: string[];
  num?: boolean;
}

interface IEmailSchema extends IBasicSchema<'email'> {}

interface INumberSchema extends IBasicSchema<'number'> {
  minValue?: number;
  maxValue?: number;
}

interface IBooleanSchema extends IBasicSchema<'boolean'> {}

export {
  IValidationSchema,
  IEmailSchema,
  INumberSchema,
  IStringSchema,
  ValidationSchemaTypes,
  IBooleanSchema,
};
