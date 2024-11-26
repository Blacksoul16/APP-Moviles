import { Component, OnInit } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { TranslateModule } from '@ngx-translate/core';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
	selector: 'duocuc-header',
	templateUrl: './header.component.html',
	styleUrls: ['./header.component.scss'],
	standalone: true,
	animations: [
		trigger("fadeSlideIn", [
			state("hidden", style({ opacity: 0, transform: "translateX(50px)" })),
			state("visible", style({ opacity: 1, transform: "translateX(0)" })),
			transition("hidden => visible", [
				animate("1s ease-out")
			]),
			transition("visible => hidden", [
				animate("1s ease-in")
			])
		])
	],
	imports: [CommonModule, FormsModule, IonicModule, RouterModule, TranslateModule]
})
export class HeaderComponent  implements OnInit {

	colState = "hidden"

	constructor() {}

	ngOnInit() { this.colState = "visible" }

	toggleAnim() { this.colState = this.colState === "hidden" ? "visible" : "hidden" }

}
