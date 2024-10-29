import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { ToastService } from 'src/app/servicios/toast.service';

@Component({
	selector: 'duocuc-menu-lateral',
	templateUrl: './menu-lateral.component.html',
	styleUrls: ['./menu-lateral.component.scss'],
})
export class MenuLateralComponent  implements OnInit {

	public paletteToggle: boolean = true

	constructor(private ruta: Router, private menu: MenuController, private toast: ToastService) {}

	ngOnInit() {
		this.initializeDarkPalette(true)
	}

	initializeDarkPalette(isDark: any) { this.paletteToggle = isDark; this.toggleDarkPalette(isDark) }
	toggleChange(e: any) { this.toggleDarkPalette(e.detail.checked) }
	toggleDarkPalette(shouldAdd: any) { document.documentElement.classList.toggle("ion-palette-dark", shouldAdd) }

	public togglearMenuLateral() { this.menu.toggle() }

	public cerrarSesion(): void {
		this.menu.close().then(() => {
			this.ruta.navigate(["login"], { replaceUrl: true })
			this.toast.showMsg("Se ha cerrado la sesión.", 2000, "success")
		})
	}

}
