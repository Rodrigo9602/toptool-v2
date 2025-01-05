import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SideMenuService {
  private menuExpandedSubject = new BehaviorSubject<boolean>(true);
  menuExpanded$ = this.menuExpandedSubject.asObservable();

  toggleMenu() {
    this.menuExpandedSubject.next(!this.menuExpandedSubject.value);
  }

  setMenuExpanded(expanded: boolean) {
    this.menuExpandedSubject.next(expanded);
  }
}