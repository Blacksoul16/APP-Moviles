import { Injectable } from "@angular/core";
import { ToastController } from "@ionic/angular";

@Injectable({
	providedIn: "root"
})

export class ToastService {
	constructor(private toastController: ToastController) {}
	/**
	 * Tiempo: Valor en milésimas de segundo. 1000ms = 1sec.
	 * Colores: Primary, Secondary, Terciary, Danger, Success, Light, Dark.
	 * Posiciones: Top, Bottom, Middle.
	 */
	async showMsg(msg: string, tiempo: number = 2500, color: string = "primary", posicion: any = "top") {
		const toast = await this.toastController.create({
			message: msg,
			duration: tiempo,
			color: color,
			position: posicion
		})
		toast.present()
	}
}