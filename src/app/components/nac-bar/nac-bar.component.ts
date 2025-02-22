import { Component } from '@angular/core';
import { TrivialService } from '../../services/trivial.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nac-bar',
  standalone: false,
  templateUrl: './nac-bar.component.html',
  styles: ``
})
export class NacBarComponent {
  isLoggedIn: boolean = false;
  acceder: string="img/akseder.png";
  registrarse: string="img/rejistrarse.png";
  exit: string="img/exyt.png";
  about: string="img/avout.png";
  partida: string="img/partyda.png";

  constructor(private route: Router ,private trivialService: TrivialService) {
    // Compruebe si el usuario ha iniciado sesión verificando si existe el token
    this.isLoggedIn = !!this.trivialService.getToken();
  }

  logout() {
    this.trivialService.logout();
    this.isLoggedIn = false;
    this.route.navigate(['home']);
  }



  
}
