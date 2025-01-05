import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { SidemenuComponent } from '../../components/sidemenu/sidemenu.component';
import { NavbarComponent } from '../../components/navbar/navbar.component';

import { SideMenuService } from '../../services/utils/sidemenu.service';

@Component({
  selector: 'app-base-layout',
  imports: [NavbarComponent, SidemenuComponent, CommonModule, RouterModule],
  templateUrl: './base-layout.component.html',
  styleUrl: './base-layout.component.scss'
})
export class BaseLayoutComponent implements OnInit {
  sideMenuExpanded = true;

  constructor(private sideMenuService: SideMenuService) {}

  ngOnInit() {
    // Nos suscribimos al estado del menú
    this.sideMenuService.menuExpanded$.subscribe(
      expanded => this.sideMenuExpanded = expanded
    );
  }
}
