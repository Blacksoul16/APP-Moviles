import { Component, OnInit } from '@angular/core';
import { Usuario } from 'src/app/model/usuario';
import { ToastService } from '../servicios/toast.service';
import { NivelEducacional } from 'src/app/model/nivel-educacional';
import { Router, NavigationExtras, ActivatedRoute } from '@angular/router';
import { AlertService } from '../servicios/alert.service';

@Component({
  selector: 'app-incorrecto',
  templateUrl: './incorrecto.page.html',
  styleUrls: ['./incorrecto.page.scss'],
})
export class IncorrectoPage implements OnInit {

  constructor(private rutaActivada: ActivatedRoute, private ruta: Router, private toast: ToastService, private alert: AlertService) {}

  ngOnInit() {
  }

  public volverLogin(): void{
    this.ruta.navigate(['login'])
  }
}
