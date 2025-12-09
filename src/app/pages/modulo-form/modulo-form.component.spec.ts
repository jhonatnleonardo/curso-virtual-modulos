import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModuloFormComponent } from './modulo-form.component';

describe('ModuloFormComponent', () => {
  let component: ModuloFormComponent;
  let fixture: ComponentFixture<ModuloFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModuloFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModuloFormComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
