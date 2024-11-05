import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { ToastService } from './servicios/toast.service';
import { ThemeService } from './servicios/theme.service';
import { AuthService } from './servicios/auth.service';

@Component({
	selector: 'app-root',
	templateUrl: 'app.component.html',
	styleUrls: ['app.component.scss'],
})
export class AppComponent {

	public mostrarComponentes: boolean = false
	public darkMode: boolean = false

	constructor(private ruta: Router, private menu: MenuController, private toast: ToastService, private theme: ThemeService, private auth: AuthService) {
		this.ruta.events.subscribe((e: any) => {
			if (e.url) {
				this.mostrarComponentes = this.checkComponentes(e.url)
			}
		})
	}

	ngOnInit() { this.darkMode = this.theme.getDarkMode() }

	toggleChange(e: any) { 
		this.theme.toggleDarkMode(e.detail.checked)
		this.darkMode = e.detail.checked
	}

	checkComponentes(url: string): boolean {
		return url.includes("inicio") || url.includes("misdatos") || url.includes("miclase") || url.includes("foro")
	}

	public togglearMenuLateral() { this.menu.toggle() }

	public cerrarSesion(): void {
		this.menu.close().then(() => {
			this.auth.logout()
			this.toast.showMsg("Se ha cerrado la sesión.", 2000, "success")
			// localStorage.clear()
		})
	}


}
