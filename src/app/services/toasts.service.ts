import { inject, Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular/standalone';

@Injectable({ providedIn: 'root' })
export class ToastsService {

	private toastController = inject(ToastController)
	private icons: Record<"danger" | "warning" | "success" | "info", string> = {
		danger: "alert-circle-outline",
		warning: "warning-outline",
		success: "checkmark-circle-outline",
		info: "information-circle-outline"
	}

	async showMsg(msg: string, tiempo: number = 2500, color: keyof typeof this.icons | "primary" = "primary", posicion: "top" | "bottom" | "middle" = "top") {
		try {
			const icon = this.icons[color as keyof typeof this.icons] || "information-circle-outline"
			const toast = await this.toastController.create({
				message: msg,
				duration: tiempo,
				color: color,
				position: posicion,
				icon: icon
			})
			toast.present()
		} catch (e) {
			console.error(e)
		}
	}
}
