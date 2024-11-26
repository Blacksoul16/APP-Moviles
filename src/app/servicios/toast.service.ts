import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular'

@Injectable({
	providedIn: 'root'
})
export class ToastService {

	constructor(private toastController: ToastController) {}

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
