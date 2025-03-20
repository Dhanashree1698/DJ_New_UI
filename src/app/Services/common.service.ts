import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  
  public hasRightListChanged: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public menuList: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor() { }

  setRightList(rightList: any): void {
    this.hasRightListChanged.next(rightList);
  }

  getMenuAccess() {
    return this.menuList;
  }

  setMenuAccess(menu: any) {
    this.menuList.next(menu);
  }
}
