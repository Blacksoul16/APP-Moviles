import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'duocuc-header',
	templateUrl: './header.component.html',
	styleUrls: ['./header.component.scss'],
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
	]
})
export class HeaderComponent implements OnInit {

	colState = "hidden"

	constructor() {}

	ngOnInit() { this.colState = "visible" }

	toggleAnim() { this.colState = this.colState === "hidden" ? "visible" : "hidden" }

}
