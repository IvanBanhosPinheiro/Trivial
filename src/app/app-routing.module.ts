import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LogInComponent } from './components/log-in/log-in.component';
import { PreguntaComponent } from './components/pregunta/pregunta.component';
import { AboutComponent } from './components/about/about.component';
import { authGuard } from './guards/auth.guard';
import { ResultadoFinalComponent } from './components/resultado-final/resultado-final.component';

const routes: Routes = [
  {
    path: "home",
    component: HomeComponent
  },
  {
    path: "login",
    component: LogInComponent
  },
  {
    path: "register",
    component: LogInComponent
  },
  {
    path: "resultado",
    component: ResultadoFinalComponent,
    canActivate: [authGuard]  // Protege la ruta con el guard
  },
  {
    path: "pregunta",
    component: PreguntaComponent,
    canActivate: [authGuard]  // Protege la ruta con el guard
  },
  {
    path: "avout",
    component: AboutComponent
  },
  {
    path: "**",
    pathMatch: "full",
    redirectTo: "home"
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
