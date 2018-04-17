import { Component, OnInit } from '@angular/core';
import { User } from './../shared/models/account-models/index';
import { AccountService } from './../shared/services/account.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {
  isLogedIn:{state:boolean};
  user: User;
  constructor(public accountService: AccountService) { }

  logOutUser(): void {
    this.accountService.logout();
  }
  ngOnInit() {
    this.user = this.accountService.globalUser;
    this.isLogedIn = this.accountService.isLogedIn;
  }
}
