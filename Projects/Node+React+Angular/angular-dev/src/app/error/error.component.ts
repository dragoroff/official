import { Component, AfterContentChecked, Input } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
    selector: 'app-error',
    templateUrl: './error.component.html',
    styleUrls: ['./error.component.css']
})
export class ErrorComponent implements AfterContentChecked {
    @Input() validateState: string;
    @Input("controlParam") controlToValidate: FormControl;
    errors: Array<string>;

    // Must check for validation errors on this lifecycle hook:
    ngAfterContentChecked(): void {

        // Clear previous errors:
        this.errors = new Array<string>();

        // Find current errors:
        for (var key in this.controlToValidate.errors) {
            if (this.controlToValidate[this.validateState ||"touched"]) {
                this.errors.push(this.controlToValidate.errors[key]);
            }
        }
    }
}

// Note: 
// 1. formControl.errors is an object and not an array. Thus we can't use *ngFor on it.
//    formControl.errors format: { error_1: "message...", error_2: "message..." ... }.
// 2. formControl state properties are: 
//    untouched =   The control hasn't been visited.
//    touched   =   The control has been visited.
//    pristine  =   The control's value hasn't changed.
//    dirty     =   The control's value has changed.
//    valid     =   The control's value is valid.
//    invalid   =   The control's value is invalid.