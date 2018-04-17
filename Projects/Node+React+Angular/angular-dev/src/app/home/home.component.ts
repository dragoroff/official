import { Component, OnInit } from '@angular/core';
import {StoreInfo} from './../shared/models/storeInfo.model';
import { Address } from '../shared/models/address.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
storeInfo:StoreInfo;
  constructor() { }

  ngOnInit() {
    this.storeInfo=new StoreInfo();
    this.storeInfo.storeName="Book Store";
    this.storeInfo.mainImage="./../assets/images/book_home_page.png";
    this.storeInfo.address=new Address("Tel-Aviv","Hamasger",15);
    this.storeInfo.address.flag="https://restcountries.eu/data/isr.svg";
    this.storeInfo.address.name="Israel";
  }

}
