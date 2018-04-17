
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { AccountService } from './../shared/services/account.service';
import { LoginUser, User } from './../shared/models/account-models/index';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  loginUser: LoginUser;
  errorMsg: string;
  constructor(private accountService: AccountService,
    private fb: FormBuilder) {
    this.createForm();
  }

  ngOnInit() { }

  createForm() {
    this.loginForm = this.fb.group({
      userName: ['', LoginUser.userNameValidators],
      userPassword: ['', LoginUser.userPasswordValidators]
    });
  }

  changeUser() {
    this.accountService.login({
      userName: this.loginForm.value.userName,
      userPassword: this.loginForm.value.userPassword
    },
    (str:string)=>{this.errorMsg=str;})
   
  }
}
