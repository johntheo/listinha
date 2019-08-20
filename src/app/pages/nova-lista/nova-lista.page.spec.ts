import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NovaListaPage } from './nova-lista.page';

describe('NovaListaPage', () => {
  let component: NovaListaPage;
  let fixture: ComponentFixture<NovaListaPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NovaListaPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NovaListaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
