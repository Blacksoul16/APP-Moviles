import { Component, OnInit } from '@angular/core';
import { ThemeService } from '../../servicios/theme.service';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from 'src/app/servicios/auth.service';
// import { state } from '@angular/animations';

@Component({
	selector: 'app-inicio',
	templateUrl: './inicio.page.html',
	styleUrls: ['./inicio.page.scss'],
})
export class InicioPage implements OnInit {

	public darkMode: boolean = true
	public tabSeleccionado: string = "codigoqr"

	constructor(private auth: AuthService, private theme: ThemeService, private translate: TranslateService) {
		this.auth.tabSeleccionado.subscribe((tab) => {
			this.tabSeleccionado = tab
		})
	}

  	ngOnInit() {
		this.translate.use(localStorage.getItem("selectedLang") || "es")
		this.theme.darkMode$.subscribe(isDark => { this.darkMode = isDark })
	}

}
