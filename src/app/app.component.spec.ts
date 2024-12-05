import { TestBed } from '@angular/core/testing'
import { provideRouter } from '@angular/router'
import { AppComponent } from './app.component'
import { Storage } from '@ionic/storage'
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'

const storageMock: any = {
	get: () => jasmine.createSpy("get").and.returnValue(Promise.resolve(null)),
	set: () => jasmine.createSpy("set").and.returnValue(Promise.resolve()),
	remove: () => jasmine.createSpy("remove").and.returnValue(Promise.resolve())
}

describe("Test aplicación", () => {
	let fixture: any
	let app: any

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [AppComponent],
			providers: [provideRouter([]), { provide: Storage, useValue: storageMock }],
			schemas: [CUSTOM_ELEMENTS_SCHEMA]
		}).compileComponents()
		fixture = TestBed.createComponent(AppComponent)
		app = fixture.componentInstance
	})

	it("debería crear la app", async () => { expect(app).toBeTruthy() })
})