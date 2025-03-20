import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FolderStutureComponent } from './folder-stuture.component';

describe('FolderStutureComponent', () => {
  let component: FolderStutureComponent;
  let fixture: ComponentFixture<FolderStutureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FolderStutureComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FolderStutureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
