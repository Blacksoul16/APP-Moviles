import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { filter } from 'rxjs';
import { ThemeService } from 'src/app/pages/servicios/theme.service';

@Component({
  selector: 'duocuc-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent implements OnInit {

	public tabSeleccionada: string = "inicio"
	public darkMode: boolean = true

	constructor(private ruta: Router, private menu: MenuController, private theme: ThemeService) { }

	ngOnInit() {
		this.theme.darkMode$.subscribe(isDark => { this.darkMode = isDark })
		this.ruta.events.pipe(filter(e => e instanceof NavigationEnd)).subscribe((ev: any) => {
			const urlActual = ev.urlAfterRedirects.split("/")[1]
			this.tabSeleccionada = urlActual
		})
	}

	togglearMenuLateral() { this.menu.toggle() }
	
	seleccionarTab(tab: string) { this.ruta.navigate([tab]) }
}
