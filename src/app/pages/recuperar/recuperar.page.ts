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
	public usuario: Usuario
	public respuestaSecreta: string = ""
	public alertButtons = ["Ok suka"]

	constructor(private router: Router, private toastService: ToastService, private alertService: AlertService) {
		this.usuario = new Usuario("", "", "", "", "", "", "", NivelEducacional.findNivelEducacional(1)!, undefined)
	}

	ngOnInit() {}

	public validarCorreo(): void {
		const usuarioEncontrado = this.usuario.buscarUsuarioPorCorreo(this.correo)
		if (this.correo.length === 0) {
			this.toastService.showMsg("Ingresa un correo válido.", 1500, "danger")
			return
		}
		else if (!usuarioEncontrado) {
			this.toastService.showMsg("No se encontró un usuario con este correo.", 1500, "danger")
			return
		}
		this.seleccionarTab("validarPreguntaSecreta")
		this.usuario = usuarioEncontrado
	}

	public validarRespuesta(): void {
		if (this.respuestaSecreta.length === 0) {
			this.toastService.showMsg("Debes ingresar una respuesta.", 1500, "danger")
			return
		}
		else if (this.respuestaSecreta !== this.usuario.respuestaSecreta) {
			this.toastService.showMsg("Respuesta incorrecta.", 1500, "danger")
			return
		}
		this.toastService.showMsg("Respuesta correcta.", 1500, "success")
		this.alertService.showAlert("Esta es tu contraseña", "", `${this.usuario.password}`, [{text: "¡Gracias!", cssClass: "custom-button-primary"}])
	}

	public seleccionarTab(tab: string): void { this.tab = tab }

}
