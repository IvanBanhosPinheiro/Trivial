import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable,of } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TrivialService {

  private token: string = '';
  private apiUrl = 'http://localhost:8080/';

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(
      `${this.apiUrl}auth/login`, 
      { email: email, contraseña: password },
      { responseType: 'text' as 'json' } // Indicamos que la respuesta es un texto
    ).pipe(
        tap(response => {
          if (response) {
            this.token = response;
            localStorage.setItem('token', response);
            localStorage.setItem('email', email);
          } else {
            console.log("Error al coger el token");
          }
        })
    );
}

  // Método para obtener el token guardado
  getToken(): string {
    if (!this.token) {
      this.token = localStorage.getItem('token') || '';
    }
    return this.token;
  }

  // Método para crear headers con el token
  private getHttpOptions() {
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.getToken()}`
      })
    };
  }

  //Metodo que retorna el top 3
  getTop3(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}api/partidas/mejores`, this.getHttpOptions());
  }


  // Método para cerrar sesión
  logout() {
    this.token = '';
    localStorage.removeItem('token');
    localStorage.removeItem('email');
  }

  register(name: string, email: string, password: string): Observable<any> {
    const registerData = {
      nombre: name,
      email: email,
      contraseña: password  
    };
    
    return this.http.post<any>(
      `${this.apiUrl}auth/register`, 
      registerData,
      { responseType: 'text' as 'json' }
    );
  }

  // Método para obtener el email guardado
  getEmail(): string {
    return localStorage.getItem('email') || '';
  }

  //metodo para obetenr el id del jugador
  getUser(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}api/usuarios/${this.getEmail()}`, this.getHttpOptions());
  }

  //metodo para obtener las preguntas
  getPreguntas(idCategoria:string, numeroPreguntas:string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}api/preguntas/categoria/${idCategoria}?numero=${numeroPreguntas}`, this.getHttpOptions());
  }

  //metodo para obtener categorias
  getCategorias(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}api/categorias`, this.getHttpOptions());
  }

  guardarRespuesta(idUsuario: number, idPregunta: number, idPartida: number, acertada: boolean): Observable<any> {
    const respuestaData = {
      partidaId: idPartida,
      preguntaId: idPregunta,
      usuarioId: idUsuario,
      acertada: acertada
    };
  
    return this.http.post<any>(
      `${this.apiUrl}api/usprpa/partida`,
      respuestaData,
      this.getHttpOptions()
    );
  }
  
  iniciarPartida(partida: any): Observable<any> {
    const partidaFormateada = {
      fechaInicio: partida.fechaInicio,
      fechaFin: partida.fechaFin,
      usuario: {
        id: partida.usuarioId
      },
      puntuacion: partida.puntuacion
    };
  
    return this.http.post<any>(
      `${this.apiUrl}api/partidas`, 
      partidaFormateada,
      this.getHttpOptions()
    );
  }

  finalizarPartida(partida: any): Observable<any> {
    const partidaFinalizada = {
      id: partida.id,
      fechaInicio: partida.fechaInicio,
      fechaFin: new Date().toISOString().split('T')[0], // Formato YYYY-MM-DD
      usuario: {
        id: partida.usuarioId
      },
      puntuacion: partida.puntuacion
    };
  
    return this.http.post<any>(
      `${this.apiUrl}api/partidas`,
      partidaFinalizada,
      this.getHttpOptions()
    );
  }
}
