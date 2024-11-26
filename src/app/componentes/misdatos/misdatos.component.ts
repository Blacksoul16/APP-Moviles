import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { IonicModule } from '@ionic/angular';
import { AuthService } from 'src/app/servicios/auth.service';
import { ToastService } from 'src/app/servicios/toast.service';
import { DataBaseService } from 'src/app/servicios/database.service';
import { NivelEducacional } from 'src/app/model/nivel-educacional';
import { convertirFechaAISO, convertirISOAFecha } from 'src/app/tools/funcFechas';

@Component({
	selector: 'duocuc-misdatos',
	templateUrl: './misdatos.component.html',
	styleUrls: ['./misdatos.component.scss'],
	standalone: true,
	imports: [CommonModule, FormsModule, IonicModule, RouterModule, TranslateModule]
})
export class MisdatosComponent  implements OnInit {

	public usuario: any
	public usuarioCopia: any
	public fechaNacimientoISO: any
	public nuevaPassword: any

	constructor(private auth: AuthService, private toast: ToastService, private translate: TranslateService, private bd: DataBaseService) {
		this.usuario = this.auth.usuarioAutenticado.value
		this.usuarioCopia = {...this.usuario}
	}

	ngOnInit() {
		this.translate.use(localStorage.getItem("selectedLang") || "es")
		this.fechaNacimientoISO = convertirFechaAISO(this.usuario.fechaNacimiento)
	}

 	public listaNivelesEducacionales = NivelEducacional.getNivelesEducacionales();
	public actualizarNivelEducacional(event: any) { this.usuario.nivelEducacional = NivelEducacional.findNivelEducacional(event.detail.value)!; }

	public guardarCambios(): void {
		if (!this.usuario) {
			this.toast.showMsg("Error al guardar los cambios: No se encontró el usuario.", 3000, "danger")
			return
		}
		try {
			if (this.nuevaPassword) { this.usuario.password = this.nuevaPassword }
			this.usuario.fechaNacimiento = convertirISOAFecha(this.fechaNacimientoISO)
			this.bd.saveUser(this.usuario)
			this.auth.saveAuthUser(this.usuario)
			this.toast.showMsg("Cambios guardados correctamente.", 2500, "success")
		} catch (e) {
			console.error(`[misdatos.page.ts] Error en guardarCambios: ${e}`)
		}
	}

	public compareUsers(): boolean {
		return JSON.stringify(this.usuario) !== JSON.stringify(this.usuarioCopia) || this.nuevaPassword || this.fechaNacimientoISO !== convertirFechaAISO(this.usuarioCopia.fechaNacimiento)
	}
}
