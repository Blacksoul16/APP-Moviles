import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NivelEducacional } from 'src/app/model/nivel-educacional';
import { Usuario } from 'src/app/model/usuario';
import { ToastService } from '../servicios/toast.service';
import { ThemeService } from '../servicios/theme.service';

@Component({
	selector: 'app-miclase',
	templateUrl: './miclase.page.html',
	styleUrls: ['./miclase.page.scss'],
})
export class MiclasePage implements OnInit {

	public usuario: Usuario
	public datosQR: any = ""
	public datosQRKeys: any[] = []
	public darkMode: boolean = true

	constructor(private rutaActivada: ActivatedRoute, private ruta: Router, private toast: ToastService, private theme: ThemeService) {
		this.usuario = new Usuario("", "", "", "", "", "", "", true, NivelEducacional.findNivelEducacional(1)!, undefined)
		this.rutaActivada.queryParams.subscribe(params => {
			const nav = this.ruta.getCurrentNavigation()
			if (nav && nav.extras.state) {
				if (nav.extras.state["usuario"]) {
					this.usuario = nav.extras.state["usuario"]
					return
				}
				if (nav.extras.state["datosQR"]) {
					this.datosQR = nav.extras.state["datosQR"]
					this.datosQRKeys = Object.keys(this.datosQR).map(k => {
						return { k: this.formatearKey(k), v: this.datosQR[k] }
					})
				}
			}
			const usuarioGuardado = localStorage.getItem("usuarioActual")
			if (usuarioGuardado) {
				this.usuario = JSON.parse(usuarioGuardado)
			} else {
				this.toast.showMsg("Debes iniciar sesión para acceder a esta página.", 2000, "danger")
				this.ruta.navigate(["login"])
    		}
		})
	}

	ngOnInit() { this.theme.darkMode$.subscribe(isDark => { this.darkMode = isDark }) }

	public limpiarDatosQR(): void { this.datosQR = null; this.datosQRKeys = [] }

	public formatearKey(k: string): string {
		const s = k.replace(/([a-z])([A-Z])/g, "$1_$2").toLowerCase()
		let r = s.split("_").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")
		// let r = s.replace(/_/g, "").split("").map((c, i) => i === 0 || s[i - 1] === "_" ? c.toUpperCase() : c).join(" ")
		// console.log("S: " + s)
		// console.log("R: " + r)
		return r
	}
}
