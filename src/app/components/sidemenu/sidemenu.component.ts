import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { SideMenuService } from '../../services/utils/sidemenu.service';

import { MenuItem } from '../../interfaces/menuItem';


@Component({
  selector: 'app-sidemenu',
  imports: [CommonModule, RouterModule],
  templateUrl: './sidemenu.component.html',
  styleUrl: './sidemenu.component.scss'
})
export class SidemenuComponent implements OnInit {
  public expanded: boolean = true;

  menuItems: MenuItem[] = [
    {
      label: 'Dashboard',
      icon: 'pi pi-home',
      route: '/dashboard'
    },
    {
      label: 'Ordenes',
      icon: 'pi pi-file-edit',
      route: '/orders'
    },
    {
      label: 'Clientes',
      icon: 'pi pi-users',
      route: '/clients'
    },
    {
      label: 'Productos',
      icon: 'pi pi-tags',
      route: '/products'
    },
    {
      label: 'Proveedores',
      icon: 'pi pi-briefcase',
      route: '/suppliers'
    },  
    {
      label: 'Garantías',
      icon: 'pi pi-file-check',
      route: '/warranties'
    },       
    {
      label: 'Panel de control',
      icon: 'pi pi-cog',
      route: '/panel'
    }
  ];

  constructor(
    private _router: Router,
    private sideMenuService: SideMenuService
  ) {}

  ngOnInit(): void {
    this.checkScreenSize();
    window.addEventListener('resize', () => this.checkScreenSize());
    
    // Nos suscribimos al estado del menú
    this.sideMenuService.menuExpanded$.subscribe(
      expanded => this.expanded = expanded
    );
  }

  toggleMenu(): void {
    this.sideMenuService.toggleMenu();
  }

  checkScreenSize(): void {
    if (window.innerWidth < 768) {
      this.sideMenuService.setMenuExpanded(false);
    }
  } 
}
