import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { IonicModule } from '@ionic/angular';
import { HeaderComponent } from 'src/app/componentes/header/header.component';
import { FooterComponent } from 'src/app/componentes/footer/footer.component';
import { CodigoqrComponent } from 'src/app/componentes/codigoqr/codigoqr.component';
import { MisdatosComponent } from 'src/app/componentes/misdatos/misdatos.component';
import { MiclaseComponent } from 'src/app/componentes/miclase/miclase.component';
import { ForoComponent } from 'src/app/componentes/foro/foro.component';
import { UsuariosComponent } from 'src/app/componentes/usuarios/usuarios.component';
import { AuthService } from 'src/app/servicios/auth.service';

@Component({
	selector: 'app-inicio',
	templateUrl: './inicio.page.html',
	styleUrls: ['./inicio.page.scss'],
	standalone: true,
	imports: [
		CommonModule, FormsModule, IonicModule, TranslateModule,
		HeaderComponent, FooterComponent, CodigoqrComponent, MisdatosComponent,
		MiclaseComponent, ForoComponent, UsuariosComponent
	]
})
export class InicioPage implements OnInit {

	public tabSeleccionado: string = "codigoqr"

	constructor(private auth: AuthService, private translate: TranslateService) {
		this.auth.tabSeleccionado.subscribe((tab) => {
			this.tabSeleccionado = tab
		})
	}

  	ngOnInit() { this.translate.use(localStorage.getItem("selectedLang") || "es") }

}
