import { Component, OnInit } from '@angular/core';
import { CountryService } from './../shared/services/country.service';
import { RegisterUser } from './../shared/models/account-models/index';
import { CountryBasic } from './../shared/models/countryBasic.model';
import { AccountService } from '../shared/services/account.service';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  registerForm: FormGroup;
  errorMsg: string;
  newUser = new RegisterUser();
  countryList: CountryBasic[];
  selectedCountry: CountryBasic;
  selectCountryMode = false;

  constructor(private countryService: CountryService,
    private accountService: AccountService,
    private fb: FormBuilder) {
    this.createForm();
  }

  ngOnInit() {

    this.countryService.getCountriesInfo().subscribe(
      (res: CountryBasic[]) => {
        this.countryList = res;
        this.selectedCountry = res.length ? res[0] : undefined;
      }
    );
  }

  createForm() {
    this.registerForm = this.fb.group({
      firstName: ['', RegisterUser.userNameValidators],
      lastName: ['', RegisterUser.userNameValidators],
      userName: ['', RegisterUser.userNameValidators],
      password: ['', RegisterUser.userPasswordValidators]
    });
  }

  registerUser() {
    this.newUser = this.registerForm.value;
    this.accountService.register(this.newUser,(str:string)=>{this.errorMsg=str;});
  }

  setCountryMode(): void {
    this.selectCountryMode = !this.selectCountryMode;
  }

  setUserCountry(x: CountryBasic): void {
    this.setCountryMode();
    this.selectedCountry = x;
    this.newUser.country = x.name;
  }
}
