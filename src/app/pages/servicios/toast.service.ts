import { Injectable } from "@angular/core";
import { ToastController } from "@ionic/angular";

@Injectable({
	providedIn: "root"
})
export class ToastService {
	constructor(private toastController: ToastController) {}
	async showMsg(msg: string, tiempo: number = 5000, color: string = "primary") {
		const toast = await this.toastController.create({
			message: msg,
			duration: tiempo,
			color: color
		})
		toast.present()
	}
}