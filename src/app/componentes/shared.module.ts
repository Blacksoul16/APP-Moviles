import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { IonicModule } from "@ionic/angular";

import { HeaderComponent } from "./header/header.component";
import { FooterComponent } from "./footer/footer.component";
import { MenuLateralComponent } from "./menu-lateral/menu-lateral.component";
import { FormsModule } from "@angular/forms";

@NgModule({
	declarations: [HeaderComponent, FooterComponent, MenuLateralComponent],
	imports: [CommonModule, IonicModule, FormsModule],
	exports: [HeaderComponent, FooterComponent, MenuLateralComponent]
})
export class SharedModule { }