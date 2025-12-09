import { TestBed } from '@angular/core/testing';

import { AuthComponent } from './auth.component';

describe('AuthComponent', () => {
  let service: AuthComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthComponent);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
