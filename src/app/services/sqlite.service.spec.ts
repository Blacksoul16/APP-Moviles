import { TestBed } from '@angular/core/testing';
import { SqliteService } from './sqlite.service';
import { SQLiteConnection } from '@capacitor-community/sqlite';
import { CapacitorSQLite } from '@capacitor-community/sqlite';
import { AuthService } from './auth.service';
import { Storage } from '@ionic/storage-angular';

class MockSQLiteConnection {
	open = jasmine.createSpy("open")
	retrieveConnection = jasmine.createSpy("retrieveConnection")
	createConnection = jasmine.createSpy("createConnection")
	checkConnectionsConsistency = jasmine.createSpy("checkConnectionsConsistency").and.returnValue(Promise.resolve({ result: true }))
	isConnection = jasmine.createSpy("isConnection").and.returnValue(Promise.resolve({ result: true }))
	closeConnection = jasmine.createSpy("closeConnection")
}

class MockCapacitorSQLite {
	addUpgradeStatement = jasmine.createSpy("addUpgradeStatement")
	deleteDatabase = jasmine.createSpy("deleteDatabase")
}

class MockStorage {
	create = jasmine.createSpy("create").and.returnValue(Promise.resolve())
	get = jasmine.createSpy("get").and.returnValue(Promise.resolve(null))
	set = jasmine.createSpy("set").and.returnValue(Promise.resolve())
	remove = jasmine.createSpy("remove").and.returnValue(Promise.resolve())
}

describe("SqliteService", () => {
	let sqliteService: SqliteService
	let mockSQLiteConnection: MockSQLiteConnection
	let mockCapacitorSQLite: MockCapacitorSQLite
	let authService: AuthService
	let mockStorage: MockStorage

	beforeEach(() => {
		mockStorage = new MockStorage()
		mockSQLiteConnection = new MockSQLiteConnection()
		mockCapacitorSQLite = new MockCapacitorSQLite()

		TestBed.configureTestingModule({
			providers: [
				SqliteService,
				{ provide: SQLiteConnection, useValue: mockSQLiteConnection },
				{ provide: CapacitorSQLite, useValue: mockCapacitorSQLite },
				{ provide: Storage, useValue: mockStorage }
			]
		})

		sqliteService = TestBed.inject(SqliteService)
		authService = TestBed.inject(AuthService)
	})

	it("should be created", () => { expect(sqliteService).toBeTruthy() })

	it("should initialize the plugin correctly", async () => {
		const result = await sqliteService.initPlugin()
		expect(result).toBe(true)
		expect(sqliteService.isService).toBe(true)
		expect(sqliteService.sqliteConnection instanceof SQLiteConnection).toBe(true)
	})

	it("should initialize auth and call create on storage", async () => {
		await authService.initAuth()
		expect(mockStorage.create).toHaveBeenCalled()
	})
})
