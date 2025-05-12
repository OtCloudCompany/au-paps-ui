import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisitsLineChartComponent } from './visits-line-chart.component';

describe('VisitsLineChartComponent', () => {
  let component: VisitsLineChartComponent;
  let fixture: ComponentFixture<VisitsLineChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VisitsLineChartComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VisitsLineChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
