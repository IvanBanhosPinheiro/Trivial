import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TrivialService } from '../../services/trivial.service';

@Component({
  selector: 'app-resultado-final',
  standalone: false,
  templateUrl: './resultado-final.component.html',
  styleUrl: './resultado-final.component.css'
})
export class ResultadoFinalComponent implements OnInit {
  imagenJugar: string = 'img/volverJugar.png';
  imagenInicio: string = 'img/volverInicio.png';
  puntuacion: number = 0;
  usuario: any = {};
  mensaje: string = '';

  constructor(
    private router: Router,
    private trivialService: TrivialService
  ) {
    // Obtener la puntuación del estado de navegación
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras?.state) {
      this.puntuacion = navigation.extras.state['puntuacion'];
    }
  }

  ngOnInit() {
    if (!this.trivialService.getToken()) {
      this.router.navigate(['/login']);
      return;
    }

    this.cargarUsuario();
    this.establecerMensaje();
  }

  private cargarUsuario() {
    this.trivialService.getUser().subscribe({
      next: (response) => {
        this.usuario = response;
      },
      error: (error) => {
        console.error('Error al obtener usuario:', error);
        this.router.navigate(['/login']);
      }
    });
  }

  private establecerMensaje() {
    if (this.puntuacion >= 80) {
      this.mensaje = '¡Excelente! Eres un maestro del conocimiento.';
    } else if (this.puntuacion >= 60) {
      this.mensaje = '¡Muy bien! Tienes un buen dominio de los temas.';
    } else if (this.puntuacion >= 40) {
      this.mensaje = 'Bien hecho, pero hay espacio para mejorar.';
    } else {
      this.mensaje = 'Sigue practicando para mejorar tus resultados.';
    }
  }

  volverAJugar() {
    this.router.navigate(['/pregunta']);
  }

  irAlInicio() {
    this.router.navigate(['/home']);
  }
}