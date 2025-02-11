import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { SkeletonModule } from 'primeng/skeleton';
import { MenuModule, Menu } from 'primeng/menu';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MenuItem } from 'primeng/api';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';

import { mockClients } from '../../mock/mock-clients';
import { Client } from '../../interfaces/client';

import { ProccessDeleteComponent } from '../../components/dialogs/proccess-delete/proccess-delete.component';

@Component({
  selector: 'app-clients',
  imports: [
    ProccessDeleteComponent,
    CommonModule,
    FormsModule,
    TableModule,
    SkeletonModule,
    MenuModule,
    ButtonModule,
    InputTextModule
  ],
  templateUrl: './clients.component.html',
  styleUrl: './clients.component.scss',
})
export class ClientsComponent implements OnInit {
  @ViewChild('menu') menu!: Menu;
  public showConfirmDeleteModal: boolean = false;

  // Variables de estado
  public clients: Client[] = [];
  public filteredClients: Client[] = [];
  public loading: boolean = true;
  public rows: number = 5;
  public totalRecords: number = 0;
  public searchText: string = '';

  // Menú contextual
  public contextMenuItems: MenuItem[] = [];
  public selectedClient: Client | null = null;

  // Observable para el debounce de la búsqueda
  private searchSubject = new Subject<string>();

  constructor() {
    // Configurar el debounce para la búsqueda
    this.searchSubject
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe(() => {
        this.search();
      });
  }

  ngOnInit(): void {
    this.loadInitialData();
  }

  private loadInitialData(): void {
    // Simula una carga de datos
    this.loading = true;
    setTimeout(() => {
      this.clients = mockClients;
      this.totalRecords = this.clients.length;
      this.search();
      this.loading = false;
    }, 1000);
  }

  loadClients(event: any): void {
    const { first, rows } = event;

    // Aquí implementarías la lógica de paginación real con el backend
    // Por ahora simulamos con los datos mock
    this.loading = true;
    setTimeout(() => {
      const filtered = this.search(false);
      this.filteredClients = filtered.slice(first, first + rows);
      this.loading = false;
    }, 300);
  }

  onSearch(): void {
    this.searchSubject.next(this.searchText);
  }

  search(updateTable: boolean = true): Client[] {
    const searchTerm = this.searchText.toLowerCase().trim();

    const filtered = searchTerm
      ? this.clients.filter(
          (client) =>
            client.name.toLowerCase().includes(searchTerm) ||
            client.lastname.toLowerCase().includes(searchTerm) ||
            client.ci.includes(searchTerm)
        )
      : [...this.clients];

    if (updateTable) {
      this.totalRecords = filtered.length;
      this.filteredClients = filtered.slice(0, this.rows);
    }

    return filtered;
  }

  showMenu(event: MouseEvent, client: Client): void {
    event.stopPropagation();
    this.selectedClient = client;
    this.contextMenuItems = this.getMenuItems(client);
    this.menu.toggle(event);
  }

  private getMenuItems(client: Client): MenuItem[] {
      return [        
        {
          separator: true
        },
        {
          label: 'Editar',
          icon: 'pi pi-pencil',
          command: () => this.editClient(client),
        },
        {
          separator: true
        },
        {
          label: 'Eliminar',
          icon: 'pi pi-trash',
          className: 'text-red-600',
          command: () => this.deleteClient(client),
        },
      ];
    }

  addClient():void {
    
  }

  editClient(client:Client):void {
    console.log(client);
  }

  deleteClient(client:Client):void {
    this.showConfirmDeleteModal = true;       
  }

  onDeleteConfirm(): void {
    this.clients = this.clients.filter(c => c.id !== this.selectedClient!.id);
    this.search(); 
  }
}
