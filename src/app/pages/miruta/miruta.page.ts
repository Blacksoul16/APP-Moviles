import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LoadingController } from '@ionic/angular';
import { HeaderComponent } from 'src/app/components/header/header.component';
import * as L from "leaflet";
import { GeolocationService } from 'src/app/services/geolocation.service';
import { HttpClient } from '@angular/common/http';
import { ToastService } from 'src/app/services/toast.service';
import { IonContent, IonBadge, IonFooter, IonToolbar, IonGrid, IonRow, IonCol, IonButton, IonIcon } from "@ionic/angular/standalone";

@Component({
	selector: 'app-miruta',
	templateUrl: './miruta.page.html',
	styleUrls: ['./miruta.page.scss'],
	standalone: true,
	imports: [
		IonIcon, IonButton, IonCol, IonRow, IonGrid, IonToolbar, IonFooter, IonBadge, IonContent, 
		CommonModule, FormsModule, RouterModule, TranslateModule, HeaderComponent
	]
})
export class MirutaPage implements OnInit {

	map: L.Map | null = null
	addressName: string = ""
	distance: string = ""
	errorMsg: string = ""
	

	constructor(
		private geo: GeolocationService, private http: HttpClient, private translate: TranslateService, 
		private toast: ToastService, private loading: LoadingController, 
	) {}

	ngOnInit() {
		this.translate.use(localStorage.getItem("selectedLang") || "es")
		this.loadMap()
		this.fixLeafletIconPath()
	}

	async loadMap() {
		const loading = await this.loading.create({ message: "El mapa está cargando...", spinner: "crescent", cssClass: "custom-loading" })
		await loading.present()

		try {
			const pos = await this.geo.getCurrentPosition()
			if (!pos) {
				this.errorMsg = "Posición geográfica desconocida."
				this.toast.showMsg(this.errorMsg, 3000, "danger")
				return
			}
			this.map = L.map("mapId").setView([pos.lat, pos.lng], 16)
			L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", 
				{maxZoom: 19, attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'}
			).addTo(this.map)
			this.goToMyPos()
		} catch (e) {
			this.handleGeoError(e)
			loading.dismiss()
		} finally {
			loading.dismiss()
		}
	}
	

	goToDUOC() { this.goToPosition(-33.44703, -70.65762, 60, "DUOC Padre Alonso de Ovalle") }

	async goToMyPos() {
		this.geo.getCurrentPosition().then((pos: { lat: number, lng: number } | null ) => {
			if (pos) {
				this.goToPosition(pos.lat, pos.lng, 60, "Mi ubicación")
			}
		})
	}

	goToPosition(lat: number, lng: number, zoom: number, popupText: string) {
		if (this.map) {
			this.map.setView([lat, lng], zoom)
			const marker = L.marker([lat, lng]).addTo(this.map)
			marker.bindPopup(popupText).openPopup()
		}
	}

	async getMyAddress(lat: number, lng: number) {
		this.geo.getPlaceFromCoords(lat, lng).subscribe({
			next: (value: any) => {
				this.addressName = value.display_name
			},
			error: (error: any) => {
				console.error(error)
				this.addressName = ""
			}
		})
	}

	async showRouteToDUOC() {
		this.geo.getCurrentPosition().then((pos: { lat: number, lng: number } | null) => { //Esta vaina tarda mucho, chamo.
			if (pos) {
				this.goToPosition(pos.lat, pos.lng, 30, "Mi ubicación")
				this.getRoute({ lat: pos.lat, lng: pos.lng }, { lat: -33.44703, lng: -70.65762 }, "walking")
			}
		})
	}

	getRoute(start: { lat: number, lng: number }, end: { lat: number, lng: number }, mode: "driving" | "walking") {
		const url = `https://router.project-osrm.org/route/v1/${mode}/${start.lng},${start.lat};${end.lng},${end.lat}?overview=full&geometries=geojson`
		this.http.get(url).subscribe((res: any) => {
			if (this.map) {
				const routeCoords = res.routes[0].geometry.coordinates
				const routeLatings = routeCoords.map((coord: [number, number]) => [coord[1], coord[0]])
				const routeLine = L.polyline(routeLatings, { color: "blue", weight: 5 }).addTo(this.map)
				this.map.fitBounds(routeLine.getBounds())

				const distance = res.routes[0].distance / 1000
				const duration = res.routes[0].duration / 60

				this.distance = `Distancia: ${distance.toFixed(2)} km. | Estimado: ${duration.toFixed(2)} mins.`
			}
		})
	}

	fixLeafletIconPath() {
		const iconDefault = L.icon({
			iconUrl: "assets/leaflet/images/marker-icon.png",
			shadowUrl: "assets/leaflet/images/marker-shadow.png"
		})
		L.Marker.prototype.options.icon = iconDefault
	}

	private handleGeoError(e: any) {
		if (e.code === 1) {
			this.errorMsg = "No hay permiso para usar la ubicación."
		} else if (e.code === 2) {
			this.errorMsg = "La ubicación no está disponible, ¿el GPS está activado?"
		} else if (e.code === 3) {
			this.errorMsg = "Se excedió el tiempo de espera para obtener la ubicación."
		} else {
			this.errorMsg = e
		}
		this.toast.showMsg(this.errorMsg, 3000, "danger");
		console.error(`[MiRuta.ts] Error al obtener la ubicación: ${e}`)
	  }

}
