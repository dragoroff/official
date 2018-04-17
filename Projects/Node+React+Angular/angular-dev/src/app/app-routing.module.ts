import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";


import { HomeComponent } from "./home/home.component";
import { AccountComponent } from "./account/account.component";
import { ProductsComponent } from "./products/products.component";
import { ProductDetailsComponent } from "./product-details/product-details.component";

import { LoginComponent } from "./login/login.component";
import { RegisterComponent } from "./register/register.component";

const appRoutes: Routes = [
    { path: "bookStore/home", component: HomeComponent },
    {
        path: "bookStore/account", component: AccountComponent, children: [
            { path: '', redirectTo: '/bookStore/account/login', pathMatch: 'full' },
            { path: 'login', component: LoginComponent },
            { path: 'register', component: RegisterComponent },
        ]
    },
    {path:'bookStore/products',component: ProductsComponent},
    { path: "bookStore/products/:id", component: ProductDetailsComponent },
    { path: "", redirectTo: "/bookStore/home", pathMatch: "full" },
    { path: "**", component: HomeComponent }
];

const appRouter = RouterModule.forRoot(appRoutes);

@NgModule({
    imports: [appRouter]
})
export class AppRoutingModule { }