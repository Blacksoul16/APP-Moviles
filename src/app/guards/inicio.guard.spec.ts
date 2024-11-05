import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { inicioGuard } from './inicio.guard';

describe('inicioGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => inicioGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
