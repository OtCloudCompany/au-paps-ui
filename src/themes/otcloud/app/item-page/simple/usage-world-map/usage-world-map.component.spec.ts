import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsageWorldMapComponent } from './usage-world-map.component';

describe('UsageWorldMapComponent', () => {
  let component: UsageWorldMapComponent;
  let fixture: ComponentFixture<UsageWorldMapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsageWorldMapComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UsageWorldMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
