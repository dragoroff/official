import { ValidatorFn, AbstractControl } from "@angular/forms";

export class ValidConfig {

    // Generate unique key:
    private static _counter = 0;
    private static get key(): string {
        return "error_" + ValidConfig._counter++;
    }

    // Required validator:
    static required(errorMessage = "This field is required."): ValidatorFn {

        return (formControl: AbstractControl) => {
            return formControl.value === null || formControl.value === "" ?
                { [ValidConfig.key]: errorMessage } :
                null;
        }
    }

    // Min length validator:
    static minLength(length: number, errorMessage = `Length can't be shorter than ${length} chars.`): ValidatorFn {
        return formControl => formControl.value.length < length ? { [ValidConfig.key]: errorMessage } : null;
    }

    // Max length validator:
    static maxLength(length: number, errorMessage = `Length can't exceeds ${length} chars.`): ValidatorFn {
        return formControl => formControl.value.length > length ? { [ValidConfig.key]: errorMessage } : null;
    }

    // Non negative (>=0) validator:
    static nonNegative(errorMessage = "This field can't be negative."): ValidatorFn {
        return formControl => +formControl.value < 0 ? { [ValidConfig.key]: errorMessage } : null;
    }

}