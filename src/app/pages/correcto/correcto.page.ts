import { Component, OnInit } from '@angular/core';
import { Usuario } from 'src/app/model/usuario';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
	selector: 'app-correcto',
	templateUrl: './correcto.page.html',
	styleUrls: ['./correcto.page.scss'],
})
export class CorrectoPage implements OnInit {
	public usuario: Usuario = new Usuario()

	constructor(private rutaActivada: ActivatedRoute, private ruta: Router, private translate: TranslateService) { 
		this.rutaActivada.queryParams.subscribe(() => {
			const nav = this.ruta.getCurrentNavigation();
			if (nav && nav.extras.state && nav.extras.state["usuario"]) {
				this.usuario = nav.extras.state["usuario"]
				return
			}
		})
	}

	ngOnInit() { this.translate.use(localStorage.getItem("selectedLang") || "es") }

}
