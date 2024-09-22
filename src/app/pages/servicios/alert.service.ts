import { Injectable } from "@angular/core";
import { AlertController } from "@ionic/angular";

@Injectable({
	providedIn: "root"
})
export class AlertService {
	constructor(private alertController: AlertController) {}
	async showAlert(header: string = "Header test", subHeader: string = "subHeader Test", msg: string = "😂", botones: any = ["Ok suka"]) {
		const alert = await this.alertController.create({
			header: header,
			subHeader: subHeader,
			message: msg,
			buttons: botones
		})
		await alert.present()
	}
}