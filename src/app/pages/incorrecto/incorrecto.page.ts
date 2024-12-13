import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonCardContent, IonCol, IonGrid, IonCard, IonRow, IonCardTitle, IonLabel, IonButton, IonBadge } from '@ionic/angular/standalone';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { RouterLink } from '@angular/router';
import { HeaderComponent } from "../../components/header/header.component";

@Component({
	selector: 'app-incorrecto',
	templateUrl: './incorrecto.page.html',
	styleUrls: ['./incorrecto.page.scss'],
	standalone: true,
	imports: [IonBadge, IonButton, IonLabel, IonCardTitle, IonRow, IonCard, IonGrid, IonCol, IonCardContent, IonContent, CommonModule, FormsModule, RouterLink, TranslateModule, HeaderComponent]
})
export class IncorrectoPage implements OnInit {

	constructor(private translate: TranslateService) {}

	ngOnInit() { this.translate.use(localStorage.getItem("selectedLang") || "es") }

}
