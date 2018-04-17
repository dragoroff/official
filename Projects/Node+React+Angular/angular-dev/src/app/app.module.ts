import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule ,ReactiveFormsModule} from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from "@angular/router";


//custom Modules
import { AppRoutingModule } from './app-routing.module';


//custom Service
import { BookService } from './shared/services/books.service';
import { CountryService } from './shared/services/country.service';
import {AccountService} from './shared/services/account.service';

//custom pipe
import {StringShortPipe} from './shared/pipes/string-short.pipe';


//custom Component
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { MainComponent } from './main/main.component';
import { ProductsComponent } from './products/products.component';
import { ProductPreviewComponent } from './product-preview/product-preview.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { AccountComponent } from './account/account.component';
import { ProductDetailsComponent } from './product-details/product-details.component';
import {CountryInfoComponent} from './country-info/country-info.component';
import {ErrorComponent} from './error/error.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    MainComponent,
    ProductsComponent,
    ProductPreviewComponent,
    HomeComponent,
    LoginComponent,
    RegisterComponent,
    AccountComponent,
    ProductDetailsComponent,
    CountryInfoComponent,
    ErrorComponent,
    StringShortPipe
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule, // Need this module for the routing
    AppRoutingModule // Import app routing module

  ],
  providers: [
    BookService,
    CountryService,
    AccountService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
