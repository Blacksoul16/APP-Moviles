import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AuthService } from 'src/app/services/auth.service';
import { ToastsService } from 'src/app/services/toasts.service';
import { DataBaseService } from 'src/app/services/database.service';
import { NivelEducacional } from 'src/app/model/nivel-educacional';
import { convertirFechaAISO, convertirISOAFecha } from 'src/app/tools/funcFechas';
import { Subscription } from 'rxjs';
import { IonDatetime, IonBadge, IonTitle, IonCard, IonCardContent, IonGrid, IonRow, IonCol, IonInput, IonSelectOption, IonSelect, IonButton, IonIcon } from "@ionic/angular/standalone";

@Component({
	selector: 'duocuc-misdatos',
	templateUrl: './misdatos.component.html',
	styleUrls: ['./misdatos.component.scss'],
	standalone: true,
	imports: [
		IonDatetime, IonIcon, IonButton, IonSelect, IonSelectOption, IonInput, IonCol, 
		IonRow, IonGrid, IonCardContent, IonCard, IonTitle, IonBadge, 
		CommonModule, FormsModule, RouterModule, TranslateModule
	],
})
export class MisdatosComponent implements OnInit, OnDestroy {

	private auth = inject(AuthService)
	private toast = inject(ToastsService)
	private translate = inject(TranslateService)
	private bd = inject(DataBaseService)
	private subs: Subscription = new Subscription()
	public usuario: any
	public usuarioCopia: any
	public fechaNacimientoISO: any
	public nuevaPassword: any

	constructor() { this.usuarioCopia = {...this.usuario} }

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
}
