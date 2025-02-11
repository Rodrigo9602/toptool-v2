import { Component, Input, Output, EventEmitter } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
@Component({
  selector: 'app-proccess-delete',
  imports: [DialogModule, ButtonModule, DividerModule],
  templateUrl: './proccess-delete.component.html',
  styleUrl: './proccess-delete.component.scss',
})
export class ProccessDeleteComponent {
  @Input() visible: boolean = false;  
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() onDelete = new EventEmitter<boolean>();

  hideModal() {
    this.visible = false;
    this.visibleChange.emit(false);
  }

  onClose(response:boolean) {
    if(response) {
      this.onDelete.emit(response);
    }    
    this.hideModal()
  }
}
