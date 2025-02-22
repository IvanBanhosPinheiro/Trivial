import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FooterComponent } from './components/footer/footer.component';
import { NacBarComponent } from './components/nac-bar/nac-bar.component';
import { PreguntaComponent } from './components/pregunta/pregunta.component';
import { LogInComponent } from './components/log-in/log-in.component';
import { ResultadoFinalComponent } from './components/resultado-final/resultado-final.component';
import { HomeComponent } from './components/home/home.component';
import { HttpClientModule } from '@angular/common/http';
import { AboutComponent } from './components/about/about.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    FooterComponent,
    NacBarComponent,
    PreguntaComponent,
    LogInComponent,
    ResultadoFinalComponent,
    HomeComponent,
    AboutComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
