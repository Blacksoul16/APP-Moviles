import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-incorrecto',
  templateUrl: './incorrecto.page.html',
  styleUrls: ['./incorrecto.page.scss'],
})
export class IncorrectoPage implements OnInit {

  constructor(private ruta: Router) {}

  ngOnInit() {}

  public volverLogin(): void{
    this.ruta.navigate(['login'])
  }
}
