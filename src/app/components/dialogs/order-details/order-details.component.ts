import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { DividerModule } from 'primeng/divider';
import { Order } from '../../../interfaces/order';

@Component({
  selector: 'app-order-details',
  imports: [CommonModule, DialogModule, DividerModule],
  templateUrl: './order-details.component.html',
  styleUrl: './order-details.component.scss'
})
export class OrderDetailsComponent{
  @Input() visible: boolean = false;
  @Input() order:Order | null = null;
  @Output() visibleChange = new EventEmitter<boolean>();

  hideModal() {
    this.visible = false;
    this.visibleChange.emit(false);    
  }
}
