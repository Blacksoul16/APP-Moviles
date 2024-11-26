import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Platform } from "@ionic/angular";
import { Geolocation, Position } from "@capacitor/geolocation"
import { Observable } from "rxjs";

@Injectable({
	providedIn: 'root'
})
export class GeolocationService {

	constructor(private platform: Platform, private http: HttpClient) {}

	async getCurrentPosition(): Promise<{ lat: number; lng: number } | null> {
		try {
			if (this.platform.is("capacitor")) {
				//Calcular posición con capacitor.
				const pos: Position = await Geolocation.getCurrentPosition({
					enableHighAccuracy: true,
					timeout: 10000,
					maximumAge: 0
				})

				const lat = pos.coords.latitude
				const lng = pos.coords.longitude

				return { lat, lng }
			} else if (this.platform.is("desktop") || this.platform.is("pwa")) {
				return new Promise((resolve, reject) => {
					if ("geolocation" in navigator) {
						//Calcular posición con el navegador.
						navigator.geolocation.getCurrentPosition((pos) => {
							const lat = pos.coords.latitude
							const lng = pos.coords.longitude
							resolve ({ lat, lng })
						}, (error) => reject(error))
					} else {
						reject("La geolocalización no está disponible.")
					}
				})
			}
			return null
		} catch (e) {
			console.error("[GeolocationService]:", e)
			return null
		}
	}

	getPlaceFromCoords(lat: number, lng: number): Observable<any> {
		const apiURL = "https://nominatim.openstreetmap.org/reverse"
		const url = `${apiURL}?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
		return this.http.get(url)
	}
}
