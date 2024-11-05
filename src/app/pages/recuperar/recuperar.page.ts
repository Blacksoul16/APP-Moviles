import { Component, OnInit } from '@angular/core';
import { ToastService } from '../../servicios/toast.service';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { DataBaseService } from 'src/app/servicios/db.service';

@Component({
	selector: 'app-recuperar',
	templateUrl: './recuperar.page.html',
	styleUrls: ['./recuperar.page.scss'],
})
export class RecuperarPage implements OnInit {
	public correo: string = ""
	public usuario: any
	public tab: string = "validarCorreo"
	public respuestaSecreta: string = ""

	constructor(private ruta: Router, private toast: ToastService, private translate: TranslateService, private bd: DataBaseService) {}

	ngOnInit() { this.translate.use(localStorage.getItem("selectedLang") || "es") }

	public seleccionarTab(tab: string): void { this.tab = tab }

	public async validarCorreo() {
		// this.toast.showMsg("Función en mantenimiento.", 2000, "warning")
		const emailRegex = /^[a-zA-Z0-9._+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
		const usuarioEncontrado = await this.bd.findUserEmail(this.correo)
		if (this.correo.length === 0) {
			this.toast.showMsg("Debes ingresar un correo.", 1500, "danger")
			return
		}
		else if (!emailRegex.test(this.correo)) {
			this.toast.showMsg("El formato del correo no es válido.", 1500, "danger")
			return
		}
		else if (!usuarioEncontrado) {
			this.toast.showMsg("No se encontró un usuario con este correo.", 1500, "danger")
			return
		}
		this.seleccionarTab("validarPreguntaSecreta")
		this.usuario = usuarioEncontrado
	}

	public async validarRespuesta() {
		if (this.respuestaSecreta.length === 0) {
			this.toast.showMsg("Debes ingresar una respuesta.", 1500, "danger")
			return
		}
		else if (this.respuestaSecreta !== this.usuario.respuestaSecreta) {
			this.ruta.navigate(["incorrecto"])
		}
		else if (this.respuestaSecreta == this.usuario.respuestaSecreta){
			this.ruta.navigate(["correcto"], { state: { "usuario": this.usuario } })
		}
	}

}
