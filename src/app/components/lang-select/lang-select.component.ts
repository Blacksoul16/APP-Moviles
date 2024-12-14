import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { IonBadge, IonGrid, IonCol, IonRow } from "@ionic/angular/standalone";

@Component({
	selector: 'app-lang-select',
	templateUrl: './lang-select.component.html',
	styleUrls: ['./lang-select.component.scss'],
	standalone: true,
	imports: [IonRow, IonCol, IonGrid, IonBadge, CommonModule, FormsModule, RouterModule, TranslateModule]
})
export class LangSelectComponent {

	protected langSelected = "es"
	protected langCodes = ["es", "en", "pt", "de", "fr", "it", "ru", "nl", "pl", "cn", "jp", "kr"]

	constructor(private translate: TranslateService) {
		const storedLang = localStorage.getItem("selectedLang") || "es"
		this.langSelected = storedLang
		this.translate.use(storedLang)
	}

	public changeLang(lang: string) {
		this.translate.use(lang)
		this.langSelected = lang
		localStorage.setItem("selectedLang", lang)
	}
}
