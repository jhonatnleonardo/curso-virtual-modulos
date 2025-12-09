import { TestBed } from '@angular/core/testing';

import { ModuloComponent } from './modulo.component';

describe('ModuloComponent', () => {
  let service: ModuloComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ModuloComponent);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
