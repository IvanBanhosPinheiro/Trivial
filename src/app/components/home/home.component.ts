import { Component, OnInit } from '@angular/core';
import { TrivialService } from '../../services/trivial.service';

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.component.html',
  styles: ``
})
export class HomeComponent implements OnInit {
  top3: any[] = [];
  constructor(private service: TrivialService) { }

  ngOnInit(): void {
    this.service.getTop3().subscribe({
      next: (response) => {
        this.top3 = response;
      },
      error: (error) => {
        console.error('Error al obtener el top 3:', error);
      }
  });
  }
}
