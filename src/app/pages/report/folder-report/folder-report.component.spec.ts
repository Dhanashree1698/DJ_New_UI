import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FolderReportComponent } from './folder-report.component';

describe('FolderReportComponent', () => {
  let component: FolderReportComponent;
  let fixture: ComponentFixture<FolderReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FolderReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FolderReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
