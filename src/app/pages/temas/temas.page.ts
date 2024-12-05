import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import { IonHeader, IonToolbar, IonSelectOption, IonSelect, IonContent, IonGrid, IonRow, IonCol, IonButton, IonIcon, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent, IonTitle, IonList, IonItem, IonLabel, IonDatetime, IonInput, IonTextarea, IonToggle, IonCheckbox } from "@ionic/angular/standalone";

@Component({
	selector: 'app-temas',
	templateUrl: './temas.page.html',
	styleUrls: ['./temas.page.scss'],
	standalone: true,
	imports: [
		IonCheckbox, IonToggle, IonTextarea, IonInput, IonDatetime, IonLabel, IonItem, IonList, 
		IonTitle, IonCardContent, IonCardSubtitle, IonCardTitle, IonCardHeader, IonCard, IonIcon, 
		IonButton, IonCol, IonRow, IonGrid, IonContent, IonToolbar, IonHeader, IonSelectOption, IonSelect,
		CommonModule, FormsModule, TranslateModule, RouterModule
	]
})
export class TemasPage implements OnInit {

	tema: string

	constructor(private translate: TranslateService) {
		this.tema = document.body.getAttribute("color-theme")! ? document.body.getAttribute("color-theme")! : "duoc"
		document.body.setAttribute("color-theme", this.tema)
	}

	ngOnInit() { this.translate.use(localStorage.getItem("selectedLang") || "es") }

	cambiarTema(e: any) {
		this.tema = e.detail.value
		document.body.setAttribute("color-theme", this.tema)
	}
}
