import { Component } from '@angular/core';
import { TrivialService } from '../../services/trivial.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-log-in',
  standalone: false,
  templateUrl: './log-in.component.html',
  styles: ``
})
export class LogInComponent {
  login: boolean = true;
  titulo: string = "Iniciar Sesión";

  constructor(private route: Router, private trivialService: TrivialService) {
    const navigation = this.route.getCurrentNavigation();
    if (navigation?.extras?.state) {
      this.login = navigation.extras.state['login'];
      this.titulo = this.login ? "Iniciar Sesión" : "Registrarse";
    }
  }

  onLogin(email: string, password: string) {
    console.log("Login con:", email, password);
    
    this.trivialService.login(email, password).subscribe({
      next: (response) => {
        // Navega a pregunta y refresca la página
        this.route.navigate(["pregunta"]).then(() => {
        window.location.reload();
      });
      },
      error: (error) => {
        console.error('Error en login', error);
      }
    });
  }

  onRegister(nombre: string, email: string, password: string) {
    console.log("Registro con:", nombre, email, password);
      
    if (!nombre || !email || !password) {
      console.error('Todos los campos son requeridos');
      return;
    }
  
    this.trivialService.register(nombre, email, password).subscribe({
      next: (response) => {
        console.log('Registro exitoso, respuesta:', response);
        if (!response.includes('Error')) {
          this.route.navigate(['login'], { 
            state: { login: true }
          });
        } else {
          console.error('Error en el registro:', response);
        }
      },
      error: (error) => {
        console.error('Error en registro:', error);
        console.error('Error real en el registro:', error.message);
      }
    });
  }
  
}