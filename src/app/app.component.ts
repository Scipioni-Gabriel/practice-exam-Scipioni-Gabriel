import {Component, inject} from '@angular/core';
import {RouterOutlet, RouterModule, Router} from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterModule] ,
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {

  title = 'practice-exam';
  private readonly router = inject(Router)

  abrirForm(){}
}
