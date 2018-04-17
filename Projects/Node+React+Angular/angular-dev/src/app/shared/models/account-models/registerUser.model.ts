import { ValidatorFn, AbstractControl } from "@angular/forms";
import { ValidConfig } from "./../validators/validConfig.model";
import { ValidationRules } from "./../validators/constConfig";

export class RegisterUser{
    
        firstName:string;
        lastName:string;
        userName:string;
        password:string;
        country:string;
        

        
    static get userNameValidators(): ValidatorFn[] {
        return [
            ValidConfig.required("User name is requierd"),
            ValidConfig.minLength(ValidationRules.MIN_CHARS_USER_NAME, `can't be shorter than ${ValidationRules.MIN_CHARS_USER_NAME} chars.`),
            ValidConfig.maxLength(ValidationRules.MAX_CHARS_USER_NAME, `can't exceeds  ${ValidationRules.MAX_CHARS_USER_NAME} chars.`)
        ];
    }


    static get userPasswordValidators(): ValidatorFn[] {
        return [
            ValidConfig.required("Password is requierd"),
            ValidConfig.minLength(ValidationRules.MIN_CHARS_USER_PASSWORD, `Password can't be shorter than ${ValidationRules.MIN_CHARS_USER_PASSWORD} chars.`),
            ValidConfig.maxLength(ValidationRules.MAX_CHARS_USER_PASSWORD, `Password can't exceeds  ${ValidationRules.MAX_CHARS_USER_PASSWORD} chars.`)
        ];
    }
    }