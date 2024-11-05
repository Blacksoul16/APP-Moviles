import { Component, OnInit } from '@angular/core';
import { IonBadge, IonTitle, IonCard, IonCardContent, IonGrid } from "@ionic/angular/standalone";
import { TranslateService } from '@ngx-translate/core';
import { NivelEducacional } from 'src/app/model/nivel-educacional';
import { AuthService } from 'src/app/servicios/auth.service';
import { DataBaseService } from 'src/app/servicios/db.service';
import { ThemeService } from 'src/app/servicios/theme.service';
import { ToastService } from 'src/app/servicios/toast.service';

@Component({
	selector: 'duocuc-misdatos',
	templateUrl: './misdatos.component.html',
	styleUrls: ['./misdatos.component.scss']
})
export class MisdatosComponent  implements OnInit {

	public usuario: any
	public darkMode: boolean = true

	constructor(private auth: AuthService, private toast: ToastService, private theme: ThemeService, private translate: TranslateService, private bd: DataBaseService) { 
		this.usuario = this.auth.usuarioAutenticado.value
	}

	ngOnInit() {
		this.translate.use(localStorage.getItem("selectedLang") || "es")
		this.theme.darkMode$.subscribe(isDark => { this.darkMode = isDark })
	}

 	public listaNivelesEducacionales = NivelEducacional.getNivelesEducacionales();
	public actualizarNivelEducacional(event: any) { this.usuario.nivelEducacional = NivelEducacional.findNivelEducacional(event.detail.value)!; }

	public guardarCambios(): void {
		if (!this.usuario) {
			this.toast.showMsg("Error al guardar los cambios: No se encontró el usuario.", 2000, "danger")
			return
		}
		try {		
			this.bd.saveUser(this.usuario)
			this.auth.saveAuthUser(this.usuario)
			this.toast.showMsg("Cambios guardados correctamente.", 2000, "success")
		} catch (e) {
			console.error(`[misdatos.page.ts] Error en guardarCambios: ${e}`)
		}
	}
}
