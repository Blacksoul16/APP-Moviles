import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { IonicModule } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';

@Component({
	selector: 'duocuc-miclase',
	templateUrl: './miclase.component.html',
	styleUrls: ['./miclase.component.scss'],
	standalone: true,
	imports: [CommonModule, FormsModule, IonicModule, RouterModule, TranslateModule]
})
export class MiclaseComponent  implements OnInit {

	public usuario: any
	public datosQR: any = ""
	public datosQRKeys: any[] = []

	constructor(private auth: AuthService, private translate: TranslateService) {
		this.auth.userAuth$.subscribe((u) => { this.usuario = u })
		if (this.auth.codigoQRData.value) {
			this.datosQR = this.auth.codigoQRData.value
			this.datosQRKeys = Object.keys(this.datosQR).map(k => {
				return { k: this.formatearKey(k), v: this.datosQR[k] }
			})
		}
	}

	ngOnInit() {
		this.translate.use(localStorage.getItem("selectedLang") || "es")
	}

	public limpiarDatosQR(): void { this.datosQR = null; this.datosQRKeys = []; this.auth.codigoQRData.next(null) }
	public goToScan() { this.auth.tabSeleccionado.next("codigoqr") }
	
	public formatearKey(k: string): string {
		const s = k.replace(/([a-z])([A-Z])/g, "$1_$2").toLowerCase()
		let r = s.split("_").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")
		return r
	}
}
