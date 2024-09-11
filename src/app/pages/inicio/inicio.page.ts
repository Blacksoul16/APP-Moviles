import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NivelEducacional } from 'src/app/model/nivel-educacional';
import { Usuario } from 'src/app/model/usuario';

@Component({
	selector: 'app-inicio',
	templateUrl: './inicio.page.html',
	styleUrls: ['./inicio.page.scss'],
})
export class InicioPage implements OnInit {

	public usuario: Usuario

	constructor(private rutaActivada: ActivatedRoute, private ruta: Router) {
		this.usuario = new Usuario("", "", "", "", "", "", "", NivelEducacional.findNivelEducacional(1)!, undefined)
		this.rutaActivada.queryParams.subscribe(params => {
			const nav = this.ruta.getCurrentNavigation()
			if (nav) {
				if (nav.extras.state) {
					this.usuario = nav.extras.state["usuario"]
					return
				}
			}
			this.ruta.navigate(["login"])
		})
	}

  	ngOnInit() {}

}
