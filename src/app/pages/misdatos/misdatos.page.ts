import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import jsQR, { QRCode } from 'jsqr';
import { NivelEducacional } from 'src/app/model/nivel-educacional';
import { Usuario } from 'src/app/model/usuario';
import { ToastService } from '../../servicios/toast.service';
import { ThemeService } from '../../servicios/theme.service';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-misdatos',
  templateUrl: './misdatos.page.html',
  styleUrls: ['./misdatos.page.scss'],
})
export class MisdatosPage implements OnInit {

  	public usuario: Usuario
	public darkMode: boolean = true

	constructor(private rutaActivada: ActivatedRoute, private ruta: Router, private toast: ToastService, private theme: ThemeService, private translate: TranslateService) { 
		this.usuario = new Usuario("", "", "", "", "", "", "", true, NivelEducacional.findNivelEducacional(1)!, undefined);

		this.rutaActivada.queryParams.subscribe(params => {
			const nav = this.ruta.getCurrentNavigation()
				if (nav && nav.extras.state) {
					if (nav.extras.state["usuario"]) {
						this.usuario = nav.extras.state["usuario"]
						localStorage.setItem("usuarioActual", JSON.stringify(this.usuario))
						return;
					}
				}
				const usuarioGuardado = localStorage.getItem("usuarioActual")
				if (usuarioGuardado) {
					this.usuario = JSON.parse(usuarioGuardado);
				} else {
					this.toast.showMsg("Debes iniciar sesión para acceder a esta página.", 2000, "danger")
					this.ruta.navigate(["login"])
				}
			})
	}

	getSalut(): string {
		const h = new Date().getHours()
		if (h >= 5 && h < 12) { return "Buenos días" }
		else if (h >= 12 && h < 18) { return "Buenas tardes" }
		else { return "Buenas noches" }
	}

	ngOnInit() {
		this.translate.use(localStorage.getItem("selectedLang") || "es")
		this.theme.darkMode$.subscribe(isDark => { this.darkMode = isDark })
	}

 	public listaNivelesEducacionales = NivelEducacional.getNivelesEducacionales();
	public actualizarNivelEducacional(event: any) { this.usuario.nivelEducacional = NivelEducacional.findNivelEducacional(event.detail.value)!; }

	public guardarCambios(): void {
		if (!this.usuario) {
			this.toast.showMsg("Error al guardar los cambios: No se encontró el usuario.", 2000, "danger")
			return
		}
		const listaUsuarios = Usuario.getListaUsuarios()
		const i = listaUsuarios.findIndex(u => u.cuenta === this.usuario.cuenta)
		if (i !== -1) {
			listaUsuarios[i] = this.usuario
			Usuario.guardarListaUsuarios(listaUsuarios)
			Usuario.getUsuarioPorCuenta(this.usuario.cuenta)
		}
		this.toast.showMsg("Cambios guardados correctamente.", 2000, "success");
	}

}
