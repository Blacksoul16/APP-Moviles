import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
	selector: 'app-incorrecto',
	templateUrl: './incorrecto.page.html',
	styleUrls: ['./incorrecto.page.scss'],
})
export class IncorrectoPage implements OnInit {

	constructor(private translate: TranslateService) {}

	ngOnInit() { this.translate.use(localStorage.getItem("selectedLang") || "es") }

}
