import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { NivelEducacional } from 'src/app/model/nivel-educacional';
import { Usuario } from 'src/app/model/usuario';
import { ToastService } from '../../servicios/toast.service';
import { PopoverController } from '@ionic/angular';
import { LangSelectComponent } from 'src/app/componentes/lang-select/lang-select.component';
import { TranslateService } from '@ngx-translate/core';

@Component({
	selector: 'app-login',
	templateUrl: './login.page.html',
	styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

	public usuario: Usuario
	// public paletteToggle: boolean = true

	constructor(private toast: ToastService, private ruta: Router, private poppy: PopoverController, private translate: TranslateService) {
		const nav = this.ruta.getCurrentNavigation()
		if (nav && nav.extras.state) {
			this.usuario = nav.extras.state["usuario"] ? nav.extras.state["usuario"] : undefined
			// console.log("Usuario recuperado del estado de navegación:", this.usuario);
		} else {
			this.usuario = new Usuario("", "", "", "", "", "", "", true, NivelEducacional.findNivelEducacional(1)!, undefined);
			this.usuario.cuenta = "sgarday";
			this.usuario.password = "1234";
		}

	}

	ngOnInit() { this.translate.use(localStorage.getItem("selectedLang") || "es") }

	public login() {
		if (this.usuario) {
			if (!this.validarUsuario(this.usuario)) return
			const user: Usuario | undefined = this.usuario.buscarUsuarioValido(this.usuario.cuenta, this.usuario.password)
			if (user) {
				const extras: NavigationExtras = {
					state: { usuario: user }
				}
				localStorage.setItem("darkMode", JSON.stringify(user.modoOscuro))
				this.toast.showMsg("Inicio de sesión exitoso", 1000, "success")
				this.ruta.navigate(["inicio"], extras)
			}
		}
	}

	public validarUsuario(usuario: Usuario): boolean {
		const msgError = usuario.validarCuenta()
		if (msgError) {
			this.toast.showMsg(msgError, 4000, "danger")
			return false
		}
		return true
	}

	async langSelector(e: Event) {
		const popover = await this.poppy.create({
			component: LangSelectComponent,
			event: e,
			translucent: true,
			backdropDismiss: true,
			side: "top",
			alignment: "start",
			size: "auto"
		})
		await popover.present()
	}

}
