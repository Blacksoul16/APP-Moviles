import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AuthService } from 'src/app/services/auth.service';
import { ToastService } from 'src/app/services/toast.service';
import { DataBaseService } from 'src/app/services/database.service';
import { NivelEducacional } from 'src/app/model/nivel-educacional';
import { convertirFechaAISO, convertirISOAFecha } from 'src/app/tools/funcFechas';
import { Subscription } from 'rxjs';
import { IonBadge, IonTitle, IonCard, IonCardContent, IonGrid, IonRow, IonCol, IonInput, IonSelectOption, IonSelect, IonButton, IonIcon } from "@ionic/angular/standalone";

@Component({
	selector: 'duocuc-misdatos',
	templateUrl: './misdatos.component.html',
	styleUrls: ['./misdatos.component.scss'],
	standalone: true,
	imports: [
		IonIcon, IonButton, IonSelect, IonSelectOption, IonInput, IonCol, 
		IonRow, IonGrid, IonCardContent, IonCard, IonTitle, IonBadge, 
		CommonModule, FormsModule, RouterModule, TranslateModule
	],
})
export class MisdatosComponent implements OnInit, OnDestroy {

	private subs: Subscription = new Subscription()
	public usuario: any
	public usuarioCopia: any
	public fechaNacimientoISO: any
	public nuevaPassword: any

	constructor(private auth: AuthService, private toast: ToastService, private translate: TranslateService, private bd: DataBaseService) {
		this.usuarioCopia = {...this.usuario}
	}

	ngOnInit() {
		this.subs.add(this.auth.userAuth$.subscribe((u) => { this.usuario = u }))
		this.translate.use(localStorage.getItem("selectedLang") || "es")
		this.fechaNacimientoISO = convertirFechaAISO(this.usuario.fechaNacimiento)
	}
	ngOnDestroy() { this.subs.unsubscribe() }

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
