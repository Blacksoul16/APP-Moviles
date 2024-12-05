import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { RouterLink } from '@angular/router';
import { HeaderComponent } from 'src/app/components/header/header.component';
import { IonContent, IonCard, IonGrid, IonCol, IonRow, IonCardTitle, IonBadge, IonLabel, IonCardContent } from "@ionic/angular/standalone";

@Component({
	selector: 'app-incorrecto',
	templateUrl: './incorrecto.page.html',
	styleUrls: ['./incorrecto.page.scss'],
	standalone: true,
	imports: [
		IonCardContent, IonLabel, IonBadge, IonCardTitle, IonRow, IonCol, IonGrid, IonCard, 
		IonContent, CommonModule, FormsModule, TranslateModule, RouterLink, HeaderComponent
	]
})
export class IncorrectoPage implements OnInit {

	constructor(private translate: TranslateService) {}

	ngOnInit() { this.translate.use(localStorage.getItem("selectedLang") || "es") }

}
