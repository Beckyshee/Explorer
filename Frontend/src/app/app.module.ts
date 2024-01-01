import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { HomeComponent } from './home/home.component';
import { LandingComponent } from './landing/landing.component';
import { AdminComponent } from './admin/admin.component';
import { FooterComponent } from './footer/footer.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BookingsComponent } from './bookings/bookings.component';
import { ToursComponent } from './tours/tours.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    LandingComponent,
    AdminComponent,
    FooterComponent,
    BookingsComponent,
    ToursComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
