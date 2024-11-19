import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { AuthService } from 'src/app/servicios/auth.service';
import { ThemeService } from 'src/app/servicios/theme.service';

@Component({
  selector: 'duocuc-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent implements OnInit {

	// public darkMode: boolean = true
	public tabSeleccionada: string = "codigoqr"

	constructor(private auth: AuthService, private menu: MenuController, private theme: ThemeService) { }

	ngOnInit() {
		// this.theme.darkMode$.subscribe(isDark => { this.darkMode = isDark })
		this.auth.tabSeleccionado.subscribe((tab) => {
			this.tabSeleccionada = tab
		})
	}

	togglearMenuLateral() { this.menu.toggle() }

	changeTab(e: any) {
		const temp = e.detail.value
		if (temp === "menulateral") {
			e.target.value = this.tabSeleccionada
		} else {
			this.tabSeleccionada = temp
			this.auth.tabSeleccionado.next(this.tabSeleccionada)
		}
	}
}
