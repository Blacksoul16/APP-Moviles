import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TranslateModule, TranslateService } from '@ngx-translate/core'

@Component({
	selector: 'duocuc-lang-select',
	templateUrl: './lang-select.component.html',
	styleUrls: ['./lang-select.component.scss'],
	standalone: true,
	imports: [
		CommonModule,
		FormsModule,
		IonicModule,
		TranslateModule
	]
})
export class LangSelectComponent implements OnInit {

	@Output() changeCurrentLang = new EventEmitter()

	langSelected = "es"
	langCodes = ["es", "en", "fr"]

	constructor(private translate: TranslateService) {
		const storedLang = localStorage.getItem("selectedLang") || "es"
		this.langSelected = storedLang
		this.translate.use(storedLang)
	}

	ngOnInit() {}

	changeLang(lang: string) {
		this.translate.use(lang)
		this.langSelected = lang
		localStorage.setItem("selectedLang", lang)
		this.changeCurrentLang.emit(lang)
		// console.log(this.langSelected)
	}
}
