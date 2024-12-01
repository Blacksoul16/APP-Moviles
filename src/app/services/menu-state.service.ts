import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable({ providedIn: "root" })
export class MenuStateService {
	private menuOpenSubject = new BehaviorSubject<boolean>(false)
	public menuOpen$ = this.menuOpenSubject.asObservable()
	setMenuOpen(isOpen: boolean) { this.menuOpenSubject.next(isOpen) }
}