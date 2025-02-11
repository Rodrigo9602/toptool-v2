import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProccessDeleteComponent } from './proccess-delete.component';

describe('ProccessDeleteComponent', () => {
  let component: ProccessDeleteComponent;
  let fixture: ComponentFixture<ProccessDeleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProccessDeleteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProccessDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
