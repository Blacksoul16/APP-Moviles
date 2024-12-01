import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { IonicModule } from '@ionic/angular';

@Component({
	selector: 'app-lang-select',
	templateUrl: './lang-select.component.html',
	styleUrls: ['./lang-select.component.scss'],
	standalone: true,
	imports: [CommonModule, FormsModule, IonicModule, RouterModule, TranslateModule]

})
export class LangSelectComponent implements OnInit {

	@Output() changeCurrentLang = new EventEmitter()

	langSelected = "es"
	langCodes = ["es", "en", "pt", "de", "fr", "it", "ru", "nl", "pl", "cn", "jp", "kr"]

	constructor(private translate: TranslateService) {
		const storedLang = localStorage.getItem("selectedLang") || "es"
		this.langSelected = storedLang
		this.translate.use(storedLang)
	}
	
	ngOnInit() {}

	public changeLang(lang: string) {
		this.translate.use(lang)
		this.langSelected = lang
		localStorage.setItem("selectedLang", lang)
		this.changeCurrentLang.emit(lang)
	}
}
