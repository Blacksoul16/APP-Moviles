import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { IonicModule } from '@ionic/angular';
import { HeaderComponent } from 'src/app/components/header/header.component';
import { FooterComponent } from 'src/app/components/footer/footer.component';
import { CodigoqrComponent } from 'src/app/components/codigoqr/codigoqr.component';
import { MisdatosComponent } from 'src/app/components/misdatos/misdatos.component';
import { MiclaseComponent } from 'src/app/components/miclase/miclase.component';
import { ForoComponent } from 'src/app/components/foro/foro.component';
import { UsuariosComponent } from 'src/app/components/usuarios/usuarios.component';
import { AuthService } from 'src/app/services/auth.service';

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
export class InicioPage implements OnInit, OnDestroy {

	public tabSeleccionado: string = "codigoqr"

	constructor(private auth: AuthService, private translate: TranslateService) {}

  	ngOnInit() {
		this.auth.tabSeleccionado.subscribe((t) => { this.tabSeleccionado = t })
		this.translate.use(localStorage.getItem("selectedLang") || "es")
	}
	ngOnDestroy() {}

}
