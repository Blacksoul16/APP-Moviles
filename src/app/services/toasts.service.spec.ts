import { TestBed } from '@angular/core/testing'
import { ToastsService } from './toasts.service'
import { ToastController } from '@ionic/angular'

class MockToastController {
	create = jasmine.createSpy("create").and.returnValue({
		present: jasmine.createSpy("present"),
	})
}

describe("ToastsService", () => {
	let toastService: ToastsService
	let mockToastController: MockToastController

	beforeEach(() => {
		mockToastController = new MockToastController()
		TestBed.configureTestingModule({
			providers: [ToastsService, { provide: ToastController, useValue: mockToastController }]
		})
		
		toastService = TestBed.inject(ToastsService)
	})

	it("debería ser creado", () => { expect(toastService).toBeTruthy() })

	it("debería llamar toastController.create con los parámetros correctos", async () => {
		const m = "Test Message"; const t = 3000; const c = "success"; const p = "bottom"
		
		await toastService.showMsg(m, t, c, p)
		
		expect(mockToastController.create).toHaveBeenCalledWith({message: m, duration: t, color: c, position: p})

		const toastInstance = mockToastController.create.calls.mostRecent().returnValue
		expect(toastInstance.present).toHaveBeenCalled()
	})
})
