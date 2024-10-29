import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
	selector: 'app-temas',
	templateUrl: './temas.page.html',
	styleUrls: ['./temas.page.scss'],
})
export class TemasPage implements OnInit {

	tema: string

	constructor(private translate: TranslateService) {
		this.tema = "dark"
		// document.body.setAttribute("color-theme", this.tema)
	}

	ngOnInit() {
		this.translate.use(localStorage.getItem("selectedLang") || "es")
	}

	cambiarTema(e: any) {
		this.tema = e.detail.value
		// document.body.setAttribute("color-theme", this.tema)
	}

}
