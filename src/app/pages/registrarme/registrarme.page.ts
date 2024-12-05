import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, Validators, ReactiveFormsModule } from '@angular/forms';
import { HeaderComponent } from 'src/app/components/header/header.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import { Usuario } from 'src/app/model/usuario';
import { NivelEducacional } from 'src/app/model/nivel-educacional';
import { ToastService } from 'src/app/services/toast.service';
import { DataBaseService } from 'src/app/services/database.service';
import { AuthService } from 'src/app/services/auth.service';
import { IonContent, IonBadge, IonTitle, IonCard, IonCardTitle, IonGrid, IonRow, IonCol, IonInput, IonSelectOption, IonSelect, IonFooter, IonToolbar, IonButton, IonIcon } from "@ionic/angular/standalone";

@Component({
	selector: 'app-registrarme',
	templateUrl: './registrarme.page.html',
	styleUrls: ['./registrarme.page.scss'],
	standalone: true,
	imports: [
		IonIcon, IonButton, IonToolbar, IonFooter, IonCol, IonRow, IonGrid, IonCardTitle, 
		IonCard, IonTitle, IonBadge, IonContent, IonInput, IonSelectOption, IonSelect,
		CommonModule, FormsModule, HeaderComponent, TranslateModule, RouterModule, ReactiveFormsModule
	]
})
export class RegistrarmePage implements OnInit {

	public listaNivelesEducacionales = NivelEducacional.getNivelesEducacionales()
	public registroForm!: FormGroup

	constructor(private translate: TranslateService, private fb: FormBuilder, private toast: ToastService, private db: DataBaseService, private auth: AuthService) {}

	ngOnInit() {
		this.translate.use(localStorage.getItem("selectedLang") || "es")
		this.registroForm = this.fb.group({
			cuenta: ["", Validators.required],
			correo: ["", [Validators.required, Validators.email]],
			nombre: ["", Validators.required],
			apellido: ["", Validators.required],
			preguntaSecreta: ["", Validators.required],
			respuestaSecreta: ["", Validators.required],
			nivelEducacional: ["", Validators.required],
			direccion: ["", Validators.required],
			contraseña: ["", [Validators.required, Validators.minLength(6)]],
		})
	}

	getErrorMsg(field: string): string {
		const control = this.registroForm.get(field)
		if (control?.hasError("required")) {
			return "Campo obligatorio."
		}
		if (control?.hasError("email")) {
			return "Ingresa un correo válido."
		}
		if (control?.hasError("minlength")) {
			const requiredLength = control.errors?.["minlength"]?.requiredLength
			return `Deben ser al menos ${requiredLength} caracteres.`
		}
		return ""
	}

	actualizarNivelEducacional(e: any) {
		const nivel = NivelEducacional.findNivelEducacional(e.detail.value)
		this.registroForm.patchValue({ nivelEducacional: nivel?.id || "" })
	}

	async registrarse() {
		const f = this.registroForm.value
		try {
			if (!this.registroForm.valid) {
				this.toast.showMsg("Formulario inválido.", 2500, "danger")
				return
			}
			if (await this.db.readUser(f.cuenta)) {
				this.toast.showMsg("Ya hay una cuenta con este nombre de usuario.", 3000, "danger")
				return
			}
			const u = Usuario.getNewUser(
				f.cuenta, 
				f.correo, 
				f.contraseña, 
				f.preguntaSecreta, 
				f.respuestaSecreta, 
				f.nombre, 
				f.apellido, 
				this.listaNivelesEducacionales.find(n => n.id === f.nivelEducacional)!, 
				f.fechaNacimiento || new Date(), 
				f.direccion, 
				f.imagen || "default-user.webp",
				f.rol || 0
			)
			await this.db.saveUser(u)
			this.toast.showMsg("Tu cuenta fue creada exitosamente.", 2500, "success")
			this.auth.login(u.cuenta, u.password)
		} catch (e) {
			console.error("Ocurrió un error:", e)
		}
	}
}
