import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonCard, IonGrid, IonCol, IonRow, IonCardTitle, IonBadge, IonLabel, IonCardContent, IonButton } from '@ionic/angular/standalone';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Usuario } from 'src/app/model/usuario';
import { HeaderComponent } from "../../components/header/header.component";

@Component({
	selector: 'app-correcto',
	templateUrl: './correcto.page.html',
	styleUrls: ['./correcto.page.scss'],
	standalone: true,
	imports: [IonButton, IonCardContent, IonLabel, IonBadge, IonCardTitle, IonRow, IonCol, IonGrid, IonCard, IonContent, CommonModule, FormsModule, RouterLink, TranslateModule, HeaderComponent]
})
export class CorrectoPage implements OnInit {

	private rutaActiva = inject(ActivatedRoute)
	private ruta = inject(Router)
	private translate = inject(TranslateService)

	protected usuario: Usuario = new Usuario()

	constructor() {
		this.rutaActiva.queryParams.subscribe(() => {
			const nav = this.ruta.getCurrentNavigation()
			if (nav && nav.extras.state && nav.extras.state["usuario"]) {
				this.usuario = nav.extras.state["usuario"]
				return
			}
		})
	}

	ngOnInit() { this.translate.use(localStorage.getItem("selectedLang") || "es") }

}
