import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from 'src/app/servicios/auth.service';

@Component({
	selector: 'app-inicio',
	templateUrl: './inicio.page.html',
	styleUrls: ['./inicio.page.scss'],
})
export class InicioPage implements OnInit {

	public tabSeleccionado: string = "codigoqr"

	constructor(private auth: AuthService, private translate: TranslateService) {
		this.auth.tabSeleccionado.subscribe((tab) => {
			this.tabSeleccionado = tab
		})
	}

  	ngOnInit() {
		this.translate.use(localStorage.getItem("selectedLang") || "es")
	}

}
