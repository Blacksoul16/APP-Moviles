const url = "http://localhost:8100/"
const postData = { t: "Post hecho con Cypress", b: "Este post fue hecho por una automatización con Cypress." }
const testUser = { u: "testuser", p: "1234" }
const testUserData = { no: "Cypress", ap: "Hill", di: "Dirección de fantasía", pS: "Toc toc", rS: "¿Quién es?", ed: "Superior completa", fe: "2000-01-01T00:00:00.000Z" }

describe("Verificar aplicación", () => {
	it("Verificar login incorrecto", () => {
		cy.visit(url).then(() => {
			cy.get("input[type='text']").type("correo@malo.cyp")
			cy.get("input[type='password']").type("123456")
			cy.get("#btn_login").click()
			cy.url().should("eq", url + "login")
		})
	}),
	it("Verificar login correcto", () => {
		cy.visit(url).then(() => {
			cy.get("input[type='text']").type(testUser.u)
			cy.get("input[type='password']").type(testUser.p)
			cy.get("#btn_login").click()
			cy.url().should("eq", url + "inicio")

			cy.get("#tab_menulateral").click()
			cy.get("#btn_logout").click()
			cy.url().should("eq", url + "login")
		})
	})
	it("Añadir post", () => {
		cy.visit(url).then(() => {
			cy.get("input[type='text']").type(testUser.u)
			cy.get("input[type='password']").type(testUser.p)
			cy.get("#btn_login").click()
			
			cy.get("#tab_foro").click()
			cy.get("#post_titulo").type(postData['t'])
			cy.get("#post_cuerpo").type(postData['b'])
			cy.get("#post_submit").click()

			cy.get("ion-card-content").contains(postData['t']).should("exist")
			cy.get("ion-card-content").contains(postData['b']).should("exist")
			
			cy.get("#tab_menulateral").click()
			cy.get("#btn_logout").click()
			cy.url().should("eq", url + "login")
		})
	}),
	it("Verificar y eliminar post", () => {
		cy.visit(url).then(() => {
			cy.get("input[type='text']").type(testUser.u)
			cy.get("input[type='password']").type(testUser.p)
			cy.get("#btn_login").click()
			
			cy.get("#tab_foro").click()
			cy.contains("ion-card", postData['t']).within(() => { cy.get("#post_delete").click() })

			cy.get("ion-card-content").contains(postData['t']).should("not.exist")
			cy.get("ion-card-content").contains(postData['b']).should("not.exist")

			cy.get("#tab_menulateral").click()
			cy.get("#btn_logout").click()
			cy.url().should("eq", url + "login")
		})
	}),
	it("Modificar datos personales", { includeShadowDom: true }, () => {
		cy.visit(url).then(() => {
			cy.get("input[type='text']").type(testUser.u)
			cy.get("input[type='password']").type(testUser.p)
			cy.get("#btn_login").click()

			cy.get("#tab_misdatos").click()
			cy.get("#input_nombre input").clear().type(testUserData.no)
			cy.get("#input_apellido input").clear().type(testUserData.ap)
			cy.get("#input_direccion input").clear().type(testUserData.di)
			cy.get("#input_preguntasecreta input").clear().type(testUserData.pS)
			cy.get("#input_respuestasecreta input").clear().type(testUserData.rS)
			cy.get("#input_niveleducacional").click()
			cy.contains("button", testUserData.ed).click()
			cy.contains("button", "OK").click()

			cy.get("#input_fechanacimiento").should("be.visible").then(($i) => {
				const d = 1; const m = 1; const y = 2000
				$i.val(testUserData.fe)
				$i.trigger("change")
				cy.get(`button[data-day="${d}"][data-month="${m}"][data-year="${y}"]`).should("be.visible").click()
			})
			cy.wait(2000)
			cy.get("#btn_save").click()
			cy.wait(2000)
			
			cy.get("#tab_menulateral").click()
			cy.get("#btn_logout").click()
			cy.url().should("eq", url + "login")
		})
	})
	it("Verificar cambio de datos personales", () => {
		cy.visit(url).then(() => {
			cy.get("input[type='text']").type(testUser.u)
			cy.get("input[type='password']").type(testUser.p)
			cy.get("#btn_login").click()

			cy.get("#tab_misdatos").click()
			cy.get("#input_nombre input").should("have.value", testUserData.no)
			cy.get("#input_apellido input").should("have.value", testUserData.ap)
			cy.get("#input_direccion input").should("have.value", testUserData.di)
			cy.get("#input_preguntasecreta input").should("have.value", testUserData.pS)
			cy.get("#input_respuestasecreta input").should("have.value", testUserData.rS)
			cy.get("#input_niveleducacional").shadow().find(".select-text").should("contain.text", testUserData.ed)
			cy.get("#input_fechanacimiento").invoke("val").should("eq", testUserData.fe)

			cy.get("#tab_menulateral").click()
			cy.get("#btn_logout").click()
			cy.url().should("eq", url + "login")
		})
	})
})