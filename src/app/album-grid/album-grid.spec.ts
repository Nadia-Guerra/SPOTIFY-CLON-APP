import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlbumGrid } from './album-grid';

describe('AlbumGrid', () => {
  let component: AlbumGrid;
  let fixture: ComponentFixture<AlbumGrid>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AlbumGrid]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AlbumGrid);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
