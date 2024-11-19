import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from 'src/app/servicios/auth.service';
import { ThemeService } from 'src/app/servicios/theme.service';

@Component({
	selector: 'duocuc-miclase',
	templateUrl: './miclase.component.html',
	styleUrls: ['./miclase.component.scss']
})
export class MiclaseComponent  implements OnInit {

	public usuario: any
	public datosQR: any = ""
	public datosQRKeys: any[] = []
	// public darkMode: boolean = true

	constructor(private auth: AuthService , private theme: ThemeService, private translate: TranslateService) {
		this.usuario = this.auth.usuarioAutenticado.value
		if (this.auth.codigoQRData.value) {
			this.datosQR = this.auth.codigoQRData.value
			this.datosQRKeys = Object.keys(this.datosQR).map(k => {
				return { k: this.formatearKey(k), v: this.datosQR[k] }
			})
		}
	}

	ngOnInit() {
		this.translate.use(localStorage.getItem("selectedLang") || "es")
		// this.theme.darkMode$.subscribe(isDark => { this.darkMode = isDark })
	}

	public limpiarDatosQR(): void { this.datosQR = null; this.datosQRKeys = []; this.auth.codigoQRData.next(null) }
	public goToScan() { this.auth.tabSeleccionado.next("codigoqr") }
	
	public formatearKey(k: string): string {
		const s = k.replace(/([a-z])([A-Z])/g, "$1_$2").toLowerCase()
		let r = s.split("_").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")
		return r
	}
}
