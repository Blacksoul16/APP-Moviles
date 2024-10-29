import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { IonicModule } from "@ionic/angular";

import { HeaderComponent } from "./header/header.component";
import { FooterComponent } from "./footer/footer.component";
import { MenuLateralComponent } from "./menu-lateral/menu-lateral.component";
import { FormsModule } from "@angular/forms";
import { TranslateModule } from "@ngx-translate/core";

@NgModule({
	declarations: [HeaderComponent, FooterComponent, MenuLateralComponent],
	imports: [CommonModule, IonicModule, FormsModule, TranslateModule],
	exports: [HeaderComponent, FooterComponent, MenuLateralComponent, TranslateModule]
})
export class SharedModule { }