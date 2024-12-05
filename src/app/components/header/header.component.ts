import { Component } from '@angular/core';
import { animate, keyframes, style, transition, trigger } from '@angular/animations';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { IonHeader, IonToolbar, IonCol, IonRow, IonGrid, IonTitle } from "@ionic/angular/standalone";

@Component({
	selector: 'duocuc-header',
	templateUrl: './header.component.html',
	styleUrls: ['./header.component.scss'],
	standalone: true,
	animations: [
		trigger("kkk", [
			transition("* <=> *", [
				animate("3s ease-in-out",
					keyframes([
						style({ opacity: 0, transform: "translateX(100%)", offset: 0 }),
						style({ opacity: 1, transform: "translateX(0)", offset: 0.5 })
					])
				)
			])
		])
	],
	imports: [IonTitle, IonGrid, IonRow, IonCol, IonToolbar, IonHeader, CommonModule, FormsModule, RouterModule, TranslateModule]
})
export class HeaderComponent {}