import { Injectable } from "@angular/core"
import { BehaviorSubject } from "rxjs"

@Injectable({
	providedIn: "root"
})
export class ThemeService {
	private darkModeSubject = new BehaviorSubject<boolean>(this.getDarkModeFromStorage())
	public darkMode$ = this.darkModeSubject.asObservable()
	
	constructor() {
		const isDark = this.getDarkModeFromStorage()
		document.documentElement.classList.toggle("ion-palette-dark", isDark)
	}

	toggleDarkMode(isDark: boolean) {
		this.darkModeSubject.next(isDark)
		localStorage.setItem("darkMode", JSON.stringify(isDark))
		document.documentElement.classList.toggle("ion-palette-dark", isDark)
	}

	getDarkMode() { return this.darkModeSubject.getValue() }

	getDarkModeFromStorage(): boolean {
		const savedTheme = localStorage.getItem("darkMode")
		return savedTheme ? JSON.parse(savedTheme) : false
	}
}