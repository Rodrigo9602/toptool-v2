import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from '../../interfaces/menuItem';

import { ThemeService } from '../../services/utils/mode.service';

@Component({
  selector: 'app-navbar',
  imports: [],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  public isLightMode: boolean = true;
  menuItems: MenuItem[] = [
    {
      label: 'Perfil',
      icon: 'pi pi-user',
      route: '/profile'
    }    
  ]

  constructor(private _router: Router, private _theme:ThemeService) {}

  toggleTheme():void {
    this._theme.toggleTheme();
    this._theme.isDarkMode() ? this.isLightMode = false : this.isLightMode = true;
  }

  navigateTo(route: string) {
    this._router.navigate([route]);
  }

}
