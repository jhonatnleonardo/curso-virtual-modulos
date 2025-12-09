import { TestBed } from '@angular/core/testing';

import { ModuloService} from './modulo.service';

describe('Modulo', () => {
  let service: ModuloService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ModuloService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
