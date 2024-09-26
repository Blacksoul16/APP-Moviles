import { Component, OnInit } from '@angular/core';
import { Usuario } from 'src/app/model/usuario';
import { ToastService } from '../servicios/toast.service';
import { NivelEducacional } from 'src/app/model/nivel-educacional';
import { Router } from '@angular/router';
import { AlertService } from '../servicios/alert.service';

@Component({
	selector: 'app-recuperar',
	templateUrl: './recuperar.page.html',
	styleUrls: ['./recuperar.page.scss'],
})
export class RecuperarPage implements OnInit {
	public correo: string = ""
	public tab: string = "validarCorreo"
	public usuario: Usuario = new Usuario("", "", "", "", "", "", "", NivelEducacional.findNivelEducacional(1)!, undefined)
	public respuestaSecreta: string = ""

	constructor(private router: Router, private toast: ToastService, private alert: AlertService) {}

	ngOnInit() {}

	public validarCorreo(): void {
		const emailRegex = /^[a-zA-Z0-9._+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
		const usuarioEncontrado = this.usuario.buscarUsuarioPorCorreo(this.correo)
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

	public validarRespuesta(): void {
		if (this.respuestaSecreta.length === 0) {
			this.toast.showMsg("Debes ingresar una respuesta.", 1500, "danger")
			return
		}
		else if (this.respuestaSecreta !== this.usuario.respuestaSecreta) {
			this.toast.showMsg("Respuesta incorrecta.", 1500, "danger")
			return
		}
		this.toast.showMsg("Respuesta correcta.", 1500, "success")
		this.alert.showAlert("Tu contraseña", "", `${this.usuario.password}`)
	}

	public seleccionarTab(tab: string): void { this.tab = tab }

}
