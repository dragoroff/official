
import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { LoginUser, User } from './../models/account-models/index';
import { of } from 'rxjs/observable/of';
import { _throw } from 'rxjs/observable/throw';
import { RegisterUser } from '../models/account-models/registerUser.model';
import { hash } from './sha-convertor.service';

@Injectable()
export class AccountService {
  userEventEmitter: EventEmitter<User> = new EventEmitter<User>();
  globalUser: User = new User();
  isLogedIn = { state: false };
  token: string;

  constructor(private httpClient: HttpClient) {
    this.userEventEmitter.subscribe((x) => {
      this.isLogedIn.state = x.fullName != 'Guest';
    })
  }

  register(user: RegisterUser, callback: (str: string) => void): void {
    user = { ...user };
    user.password = hash(user.password);
    this.httpClient.post("/api/client", user, {
      observe: 'response',
      responseType: 'json'
    }).subscribe(res => {
      if (!res.headers.get("xx-auth")) {
        callback('Invalid user details');
      }
      this.token = res.headers.get("xx-auth");
      this.globalUser.fullName = user.userName;
      this.userEventEmitter.emit(this.globalUser);
    }, () => { callback('Invalid user details'); })

  }

  login({ userName, userPassword }: LoginUser, callback: (str: string) => void): void {
    userPassword = hash(userPassword);
    this.httpClient.get("/api/client", {
      headers: {
        "xx-auth": userPassword + userName
      },
      observe: 'response',
      responseType: 'json'
    }).subscribe(res => {
      if (!res.headers.get("xx-auth")) {
        callback('Invalid username or password');
      }
      this.token = res.headers.get("xx-auth");
      this.globalUser.fullName = userName;
      this.userEventEmitter.emit(this.globalUser);
    }, () => { callback('Invalid username or password'); })

  }

  logout(): Observable<boolean> {
    try {
      this.isLogedIn.state = false;
      this.globalUser.fullName = "Guest";
      this.globalUser.userUrlAvatar = "./../assets/images/profile.png";
      this.userEventEmitter.emit(this.globalUser);
      return of(true);
    }
    catch{
      return of(false);
    }
  }
}