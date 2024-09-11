import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { NivelEducacional } from 'src/app/model/nivel-educacional';
import { Usuario } from 'src/app/model/usuario';

@Component({
	selector: 'app-login',
	templateUrl: './login.page.html',
	styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

	public usuario: Usuario

	constructor(private toastController: ToastController, private ruta: Router) {
		this.usuario = new Usuario("", "", "", "", "", "", "", NivelEducacional.findNivelEducacional(1)!, undefined)
		this.usuario.cuenta = "sgarday"
		this.usuario.password = "1234"
	}

	ngOnInit() {}

	public login() {
		if (this.usuario) {
			if (!this.validarUsuario(this.usuario)) return
			const user: Usuario | undefined = this.usuario.buscarUsuarioValido(this.usuario.cuenta, this.usuario.password)

			if (user) {
				const extras: NavigationExtras = {
					state: {
						usuario: user
					}
				}
				this.showMsg("Bienvenido al sistema")
				this.ruta.navigate(["inicio"], extras)
			}
		}
	}

	public validarUsuario(usuario: Usuario): boolean {
		const msgError = usuario.validarCuenta()
		if (msgError) {
			this.showMsg(msgError)
			return false
		}
		return true
	}

	async showMsg(msg: string, tiempo: number = 5000) {
		const toast = await this.toastController.create({
			message: msg,
			duration: tiempo
		})
		toast.present()
	}


//   login() {
// 	if (this.nombre == "test" && this.password == "test") {
// 	  const extras: NavigationExtras = {
// 		state: {
// 		  cuenta: this.cuenta
// 		}
// 	  }

// 	  this.ruta.navigate(["inicio"], extras)

// 	  alert("Correcto.")
// 	} else {
// 	  alert("Incorrecto.")
// 	}
//   }

}
