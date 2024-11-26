import { TestBed } from '@angular/core/testing';

import { InitappService } from './initapp.service';

describe('InitappService', () => {
  let service: InitappService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InitappService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
