import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';

@Component({
	selector: 'app-temas',
	templateUrl: './temas.page.html',
	styleUrls: ['./temas.page.scss'],
	standalone: true,
	imports: [IonicModule, CommonModule, FormsModule, TranslateModule, RouterModule]
})
export class TemasPage implements OnInit {

	tema: string

	constructor(private translate: TranslateService) {
		this.tema = document.body.getAttribute("color-theme")! ? document.body.getAttribute("color-theme")! : "duoc"
		document.body.setAttribute("color-theme", this.tema)
	}

	ngOnInit() {
		this.translate.use(localStorage.getItem("selectedLang") || "es")
	}

	cambiarTema(e: any) {
		this.tema = e.detail.value
		document.body.setAttribute("color-theme", this.tema)
	}
}
