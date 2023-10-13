export type FieldErrors = {
    [field: string]: string[];
}

export interface IValidatorFields<ValidatedProps> {
    errors: FieldErrors;
    validatedData: ValidatedProps;
    validate(data: any): boolean;
}