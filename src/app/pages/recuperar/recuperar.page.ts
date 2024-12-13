import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonInput, IonContent, IonCard, IonGrid, IonCol, IonRow, IonCardTitle, IonLabel, IonCardSubtitle, IonText, IonCardContent, IonButton } from '@ionic/angular/standalone';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Router, RouterModule } from '@angular/router';
import { ToastsService } from 'src/app/services/toasts.service';
import { HeaderComponent } from "../../components/header/header.component";
import { DataBaseService } from 'src/app/services/database.service';

@Component({
	selector: 'app-recuperar',
	templateUrl: './recuperar.page.html',
	styleUrls: ['./recuperar.page.scss'],
	standalone: true,
	imports: [IonInput, IonButton, IonCardContent, IonText, IonCardSubtitle, IonLabel, IonCardTitle, IonRow, IonCol, IonGrid, IonCard, IonContent, CommonModule, FormsModule, RouterModule, TranslateModule, HeaderComponent]
})
export class RecuperarPage implements OnInit {

	private ruta = inject(Router)
	private toast = inject(ToastsService)
	private translate = inject(TranslateService)
	private bd = inject(DataBaseService)

	protected correo: string = ""
	protected usuario: any = ""
	protected tab: string = "validarCorreo"
	protected respuestaSecreta: string = "" 

	constructor() {}

	ngOnInit() { this.translate.use(localStorage.getItem("selectedLang") || "es") }

	protected async seleccionarTab(tab: string) { this.tab = tab }

	protected async validarCorreo() {
		const emailRegex = /^[a-zA-Z0-9._+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
		const usuarioEncontrado = await this.bd.findUserEmail(this.correo)
		if (this.correo.length === 0) {
			this.toast.showMsg("Debes ingresar un correo.", 1500, "danger")
			return
		}
		else if (!emailRegex.test(this.correo)) {
			this.toast.showMsg("El formato del correo no es válido.", 1500, "danger")
			return
		}
		else if (!usuarioEncontrado) {
			this.toast.showMsg("No se encontró un usuario con este correo.", 1500, "danger")
			this.ruta.navigate(["/incorrecto"]) // lol?
			return
		}
		this.seleccionarTab("validarPreguntaSecreta")
		this.usuario = usuarioEncontrado
	}

	public async validarRespuesta() {
		if (this.respuestaSecreta.length === 0) {
			this.toast.showMsg("Debes ingresar una respuesta.", 1500, "danger")
			return
		}
		else if (this.respuestaSecreta !== this.usuario.respuestaSecreta) {
			this.ruta.navigate(["incorrecto"])
		}
		else if (this.respuestaSecreta == this.usuario.respuestaSecreta){
			this.ruta.navigate(["correcto"], { state: { "usuario": this.usuario } })
		}
	}
}
