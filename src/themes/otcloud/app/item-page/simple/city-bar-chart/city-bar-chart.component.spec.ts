import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CityBarChartComponent } from './city-bar-chart.component';

describe('CityBarChartComponent', () => {
  let component: CityBarChartComponent;
  let fixture: ComponentFixture<CityBarChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CityBarChartComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CityBarChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
