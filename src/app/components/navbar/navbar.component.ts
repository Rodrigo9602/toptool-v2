import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { Menu, MenuModule } from 'primeng/menu';
import { ButtonModule } from 'primeng/button';
import { ThemeService } from '../../services/utils/mode.service';

@Component({
  selector: 'app-navbar',  
  imports: [MenuModule, ButtonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  public isLightMode: boolean = true;
  @ViewChild('menu') menu!: Menu; // Referencia al menú contextual
  public contextMenuItems: MenuItem[] = [];

  constructor(private _router: Router, private _theme: ThemeService) {}

  toggleTheme(): void {
    this._theme.toggleTheme();
    this.isLightMode = !this._theme.isDarkMode();
  }

  navigateTo(route: string) {
    this._router.navigate([route]);
  }

  showMenu(event: MouseEvent): void {
    event.stopPropagation();
    this.contextMenuItems = this.getMenuItems();
    this.menu.toggle(event); // Muestra el menú contextual
  }

  private getMenuItems(): MenuItem[] {
    return [
      {
        label: 'Perfil',
        icon: 'pi pi-cog',
        command: () => this._router.navigate(['/profile']),
      },
      {
        separator: true,
      },
      {
        label: 'Logout',
        icon: 'pi pi-sign-out',
        command: () => this._router.navigate(['/']),
      },
    ];
  }
}