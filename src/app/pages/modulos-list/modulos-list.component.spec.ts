import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModulosListComponent } from './modulos-list.component';

describe('ModulosListComponent', () => {
  let component: ModulosListComponent;
  let fixture: ComponentFixture<ModulosListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModulosListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModulosListComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
