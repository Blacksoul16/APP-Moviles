import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { NivelEducacional } from 'src/app/model/nivel-educacional';
import { Usuario } from 'src/app/model/usuario';
import { ToastService } from '../servicios/toast.service';

@Component({
	selector: 'app-login',
	templateUrl: './login.page.html',
	styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

	public usuario: Usuario
	// public paletteToggle: boolean = true

	constructor(private toastService: ToastService, private ruta: Router) {
		const nav = this.ruta.getCurrentNavigation();
		
		if (nav && nav.extras.state && nav.extras.state["usuario"]) {
			this.usuario = nav.extras.state["usuario"];
			console.log("Usuario recuperado del estado de navegación:", this.usuario);
		} else {
			this.usuario = new Usuario("", "", "", "", "", "", "", NivelEducacional.findNivelEducacional(1)!, undefined);
			this.usuario.cuenta = "sgarday";
			this.usuario.password = "1234";
		}

	}

	ngOnInit() {
		// const prefersDark = window.matchMedia("(prefers-color-scheme: dark)")
		// this.initializeDarkPalette(prefersDark.matches)
		// prefersDark.addEventListener("change", (mediaQuery) => this.initializeDarkPalette(mediaQuery.matches))
	}

	// initializeDarkPalette(isDark: any) { this.paletteToggle = isDark; this.toggleDarkPalette(isDark) }
	// toggleDarkPalette(shouldAdd: any) { document.documentElement.classList.toggle("ion-palette-dark", shouldAdd) }

	public login() {
		if (this.usuario) {
			if (!this.validarUsuario(this.usuario)) return
			const user: Usuario | undefined = this.usuario.buscarUsuarioValido(this.usuario.cuenta, this.usuario.password)
			if (user) {
				const extras: NavigationExtras = {
					state: { usuario: user }
				}
				this.toastService.showMsg("Inicio de sesión exitoso", 1000, "success")
				this.ruta.navigate(["inicio"], extras)
			}
		}
	}

	public validarUsuario(usuario: Usuario): boolean {
		const msgError = usuario.validarCuenta()
		if (msgError) {
			this.toastService.showMsg(msgError, 4000, "danger")
			return false
		}
		return true
	}

	

}
