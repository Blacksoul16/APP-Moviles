import { Component, OnInit } from '@angular/core';
import { Usuario } from 'src/app/model/usuario';
import { ToastService } from '../../servicios/toast.service';
import { NivelEducacional } from 'src/app/model/nivel-educacional';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
	selector: 'app-correcto',
	templateUrl: './correcto.page.html',
	styleUrls: ['./correcto.page.scss'],
})
export class CorrectoPage implements OnInit {
	public usuario: Usuario = new Usuario("", "", "", "", "", "", "", true, NivelEducacional.findNivelEducacional(1)!, undefined)

	constructor(private rutaActivada: ActivatedRoute, private ruta: Router, private toast: ToastService, private translate: TranslateService) { 
		this.usuario = new Usuario("", "", "", "", "", "", "", true, NivelEducacional.findNivelEducacional(1)!, undefined);

		this.rutaActivada.queryParams.subscribe(params => {
			const nav = this.ruta.getCurrentNavigation();
			if (nav) {
				if (nav.extras.state && nav.extras.state["usuario"]) {
					this.usuario = nav.extras.state["usuario"];
					localStorage.setItem("usuarioActual", JSON.stringify(this.usuario));
					return;
				}
			}
			const usuarioGuardado = localStorage.getItem("usuarioActual");
			if (usuarioGuardado) {
				this.usuario = JSON.parse(usuarioGuardado);
			} else {
				this.toast.showMsg("Debes iniciar sesión para acceder a esta página.", 2000, "danger");
				this.ruta.navigate(["login"]);
			}
		});
	}

	ngOnInit() { this.translate.use(localStorage.getItem("selectedLang") || "es") }

}
