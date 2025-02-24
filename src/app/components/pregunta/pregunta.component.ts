import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TrivialService } from '../../services/trivial.service';

@Component({
  selector: 'app-pregunta',
  standalone: false,
  templateUrl: './pregunta.component.html',
  styleUrl: './pregunta.component.css'
})
export class PreguntaComponent implements OnInit , OnDestroy{
  puedeResponder: boolean = true;
  respuestaSeleccionada: boolean = false;
  respuestaIndice: number = -1;
  imagenSiguiente: string = "img/flecha.png";
  bien:boolean = false;
  mal:boolean = false;
  siguiente:boolean = false;
  imagen: string = "img/comensar.png";
  datosListos: boolean = false;
  preguntasCargadas: number = 0;
  iniciar: boolean = false;
  contadorCategoria: number = 0;
  contadorPregunta: number = 0;
  usuario: any = {};//{id: 6, nombre: 'usuario 2', email: 'usuario2@test.com'}

  arrayCategoria: any[] = [];
  arrayCategorias2: any[] = [];
  /*[
  {id: 1, nombre: 'Historia', descripcion: 'Preguntas relacionadas....'}
  {id: 2, nombre: 'Ciencia', descripcion: 'Preguntas sobre  ...'}
  {id: 3, nombre: 'Geografía', descripcion: 'Preguntas sobre países...'}
  {id: 4, nombre: 'Deportes', descripcion: 'Preguntas sobre ...'}
  ]*/

  //cada posicion del array se corresponde con la posicion del array de 
  // categorias y contiene otro array d 20 pregutnas
  arrayPreguntasPorCategoria: any[] = [];
  puntuacion: number = 0;

  partida: any = {
    id: null,
    fechaInicio: `${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()}`,
    fechaFin: "",
    usuarioId: this.usuario.id,
    puntuacion: 0
  };

  constructor(
    private router: Router,
    private trivialService: TrivialService
  ) {}
  ngOnDestroy(): void {
    this.trivialService.finalizarPartida(this.partida).subscribe({
      next: (response) => {
        //console.log('Partida finalizada:', response);
      },
      error: (error) => console.error('Error al finalizar partida:', error)
    });
    
  }

  ngOnInit() {
    
    //Si esta autenticado
    if (!this.trivialService.getToken()) {
      this.router.navigate(['/login']);
      return;
    }

    // Cargar datos en orden
    this.cargarUsuario().then(() => {
      this.nuevaPartida();
      this.cargarCategoriasYPreguntas();
    });
    
    
    
  }

  private async cargarUsuario(): Promise<void> {
    return new Promise((resolve) => {
      this.trivialService.getUser().subscribe({
        next: (response) => {
          this.usuario = response;
          // Actualizar el ID del usuario en el objeto partida
          this.partida.usuarioId = this.usuario.id;
          resolve();
        },
        error: (error) => {
          console.error('Error al obtener el usuario:', error);
          this.router.navigate(['/login']);
          resolve();
        }
      });
    });
  }

  private cargarCategoriasYPreguntas(): void {
    this.trivialService.getCategorias().subscribe({
      next: (response) => {
        this.arrayCategorias2 = response;
        //console.log('Categorías cargadas:', this.arrayCategoria);
        
        // Contador para saber cuándo terminan todas las cargas
        const totalCategorias = this.arrayCategorias2.length;
        this.preguntasCargadas = 0;

        // Cargar preguntas para cada categoría
        this.arrayCategorias2.forEach((categoria) => {
          this.trivialService.getPreguntas(categoria.id, "5").subscribe({
            next: (preguntasResponse) => {
              this.arrayCategoria.push(preguntasResponse.categoria)
              this.arrayPreguntasPorCategoria.push(preguntasResponse.preguntas);
              this.preguntasCargadas++;
              
              // console.log(`Preguntas cargadas para ${categoria.nombre}:`, 
              //            preguntasResponse.preguntas);
              console.log(this.arrayPreguntasPorCategoria);
              
              if (this.preguntasCargadas === totalCategorias) {
                //console.log('Todas las preguntas cargadas');
                this.datosListos = true;
              }
            },
            error: (error) => {
              console.error(`Error al cargar preguntas de ${categoria.nombre}:`, error);
              this.preguntasCargadas++;
              
              if (this.preguntasCargadas === totalCategorias) {
                this.datosListos = true;
              }
            }
          });
        });
      },
      error: (error) => {
        console.error('Error al obtener las categorías:', error);
        this.trivialService.logout();
        this.router.navigate(['/login']);
      }
    });
  }

  empezarPartida() {
    if (!this.trivialService.getToken()) {
      this.router.navigate(['/login']);
      return;
    }

    if (!this.datosListos) {
      //console.log('Esperando a que se carguen los datos...');
      return;
    }

    /*console.log('Iniciando partida con:', {
      usuario: this.usuario,
      categorias: this.arrayCategoria.length,
      preguntasCargadas: this.preguntasCargadas
    });*/
    
    this.iniciar = true;
  }

  verificarRespuesta(indice: number) {
    if (!this.puedeResponder) return;

    this.respuestaSeleccionada = true;
    this.respuestaIndice = indice;
    this.puedeResponder = false;

    const preguntaActual = this.arrayPreguntasPorCategoria[this.contadorCategoria][this.contadorPregunta];
    const respuestaSeleccionada = preguntaActual.respuestas[indice];
    
    if (respuestaSeleccionada.correcta) {
        this.puntuacion += 5;
        this.bien = true;
        this.siguiente = true;
        this.mal = false;
    } else {
        this.mal = true;
        this.siguiente = true;
        this.bien = false;
    }

    // Guardar la respuesta
    this.trivialService.guardarRespuesta(
        this.usuario.id,
        preguntaActual.id,
        this.partida.id,
        respuestaSeleccionada.correcta
    ).subscribe({
        next: () => {
            console.log('Respuesta guardada correctamente');
        },
        error: (error) => console.error('Error al guardar respuesta:', error)
    });
}

  siguientePregunta() {
    // Restablecer estados
    this.bien = false;
    this.mal = false;
    this.siguiente = false;
    this.puedeResponder = true;
    this.respuestaSeleccionada = false;
    this.respuestaIndice = -1;
  
    // Avanzar a la siguiente pregunta
    if (this.contadorPregunta < 4) {
      this.contadorPregunta++;
    } else {
      this.contadorPregunta = 0;
      if (this.contadorCategoria < this.arrayCategoria.length - 1) {
        this.contadorCategoria++;
      } else {
        // Fin del juego
        this.partida.puntuacion = this.puntuacion;
        this.partida.fechaFin = new Date().toISOString().split('T')[0];
        this.trivialService.finalizarPartida(this.partida).subscribe({
          next: () => {
            this.router.navigate(['/resultado'], { 
              state: { puntuacion: this.puntuacion } 
            });
          },
          error: (error) => console.error('Error al finalizar partida:', error)
        });
      }
    }
    console.log("Categoria: ", this.arrayCategoria[this.contadorCategoria].nombre);
    console.log("Pregunta id: ", this.arrayPreguntasPorCategoria[this.contadorCategoria][this.contadorPregunta].id);
    
    
  }

  nuevaPartida() {
    this.trivialService.iniciarPartida(this.partida).subscribe({
      next: (response) => {
        this.partida.id = response.id; // Store the returned ID
        //console.log('Partida iniciada:', response);
      },
      error: (error) => console.error('Error al iniciar partida:', error)
    });
  }
}