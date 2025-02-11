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

import { Order } from '../../interfaces/order';
import { mockOrders } from '../../mock/mock-orders';

import { CreateOrderComponent } from '../../components/dialogs/create-order/create-order.component';
import { OrderDetailsComponent } from '../../components/dialogs/order-details/order-details.component';
import { EditOrderComponent } from '../../components/dialogs/edit-order/edit-order.component';
import { ProccessDeleteComponent } from '../../components/dialogs/proccess-delete/proccess-delete.component';

@Component({
  selector: 'app-orders',  
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    SkeletonModule,
    MenuModule,
    ButtonModule,
    InputTextModule,    
    CreateOrderComponent,
    OrderDetailsComponent,
    EditOrderComponent,
    ProccessDeleteComponent
  ],
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss'],
})
export class OrdersComponent implements OnInit {
  @ViewChild('menu') menu!: Menu;
  public showOrderFormModal: boolean = false;
  public showOrderDetailsModal: boolean = false;
  public showEditOrderModal: boolean = false;
  public showConfirmDeleteModal: boolean = false;

  // Variables de estado
  public orders: Order[] = [];
  public filteredOrders: Order[] = [];
  public loading: boolean = true;
  public rows: number = 5;
  public totalRecords: number = 0;
  public searchText: string = '';  
  
  // Menú contextual
  public contextMenuItems: MenuItem[] = [];
  public selectedOrder: Order | null = null;

  // Observable para el debounce de la búsqueda
  private searchSubject = new Subject<string>();

  constructor() {
    // Configurar el debounce para la búsqueda
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(() => {
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
      this.orders = mockOrders;
      this.totalRecords = this.orders.length;
      this.search();
      this.loading = false;
    }, 1000);
  }

  loadOrders(event: any): void {
    const { first, rows } = event;
    
    // Aquí implementarías la lógica de paginación real con el backend
    // Por ahora simulamos con los datos mock
    this.loading = true;
    setTimeout(() => {
      const filtered = this.search(false);
      this.filteredOrders = filtered.slice(first, first + rows);      
      this.loading = false;
    }, 300);
  }

  onSearch(): void {
    this.searchSubject.next(this.searchText);
  }

  search(updateTable: boolean = true): Order[] {    
    const searchTerm = this.searchText.toLowerCase().trim();
    
    const filtered = searchTerm ? this.orders.filter(order => 
      order.client.name.toLowerCase().includes(searchTerm) ||
      order.client.lastname.toLowerCase().includes(searchTerm) ||
      order.services?.some(service => 
        service.description.toLowerCase().includes(searchTerm)
      ) ||
      order.sells?.some(sell => 
        sell.products.some(product => product.name.toLocaleLowerCase().includes(searchTerm) || product.description.toLocaleLowerCase().includes(searchTerm))
      ) ||
      new Date(order.warranty.emitedOn).toLocaleDateString().includes(searchTerm) ||
      new Date(order.warranty.timeStamp).toLocaleDateString().includes(searchTerm)
    ) : [...this.orders];

    if (updateTable) {      
      this.totalRecords = filtered.length;
      this.filteredOrders = filtered.slice(0, this.rows);      
    }
    
    return filtered;    
  }

  showMenu(event: MouseEvent, order: Order): void {
    event.stopPropagation();
    this.selectedOrder = order;
    this.contextMenuItems = this.getMenuItems(order);
    this.menu.toggle(event);
  }

  private getMenuItems(order: Order): MenuItem[] {
    return [
      {
        label: 'Ver datos',
        icon: 'pi pi-eye',
        command: () => this.viewOrder(order),
      },
      {
        separator: true
      },
      {
        label: 'Editar',
        icon: 'pi pi-pencil',
        command: () => this.editOrder(order),
      },
      {
        separator: true
      },
      {
        label: 'Eliminar',
        icon: 'pi pi-trash',
        className: 'text-red-600',
        command: () => this.deleteOrder(),
      },
    ];
  }

  addOrder(): void {
    this.showOrderFormModal = true;
  }

  onSaveOrder(newOrder: Order): void {   
    this.orders.unshift(newOrder);
    this.search();
  }

  viewOrder(order: Order): void {    
    this.selectedOrder = order;
    this.showOrderDetailsModal = true;    
  }

  editOrder(order: Order): void {
    this.selectedOrder = order;
    this.showEditOrderModal = true;
  }

  deleteOrder(): void {
    this.showConfirmDeleteModal = true;       
  }

  onDeleteConfirm(): void {
    this.orders = this.orders.filter(o => o.id !== this.selectedOrder!.id);
    this.search(); 
  }
}