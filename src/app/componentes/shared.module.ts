import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { IonicModule } from "@ionic/angular";

import { HeaderComponent } from "./header/header.component";
import { FooterComponent } from "./footer/footer.component";
import { MenuLateralComponent } from "./menu-lateral/menu-lateral.component";
import { FormsModule } from "@angular/forms";
import { TranslateModule } from "@ngx-translate/core";
import { CodigoqrComponent } from "./codigoqr/codigoqr.component";
import { MisdatosComponent } from "./misdatos/misdatos.component";
import { MiclaseComponent } from "./miclase/miclase.component";
import { ForoComponent } from "./foro/foro.component";

@NgModule({
	declarations: [
		HeaderComponent, 
		FooterComponent, 
		MenuLateralComponent, 
		CodigoqrComponent, 
		MisdatosComponent, 
		MiclaseComponent,
		ForoComponent
	],
	imports: [CommonModule, IonicModule, FormsModule, TranslateModule],
	exports: [
		HeaderComponent, 
		FooterComponent, 
		MenuLateralComponent, 
		TranslateModule, 
		CodigoqrComponent, 
		MisdatosComponent, 
		MiclaseComponent,
		ForoComponent
	]
})
export class SharedModule { }