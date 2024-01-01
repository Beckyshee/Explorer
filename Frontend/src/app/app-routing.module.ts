import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LandingComponent } from './landing/landing.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { BookingsComponent } from './bookings/bookings.component';
import { ToursComponent } from './tours/tours.component';
import { AdminComponent } from './admin/admin.component';
import { UsersComponent } from './users/users.component';
import { ProfileComponent } from './profile/profile.component';

const routes: Routes = [
  { path: '', component: LandingComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent },
  { path: 'admin', component: AdminComponent },
  { path: 'tours', component: ToursComponent },
  { path: 'bookings', component: BookingsComponent },
  { path: 'users', component: UsersComponent },
  { path: 'profile', component: ProfileComponent },
  // { path: 'reviews', component: BookingsComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
