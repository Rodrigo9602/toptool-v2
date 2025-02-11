import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-loading',
  imports: [],
  templateUrl: './loading.component.html',
  styleUrl: './loading.component.scss'
})
export class LoadingComponent {
  @Input() firstColor: string = '#4338ca';  // Color del primer círculo
  @Input() secondColor: string = '#6366f1'; // Color del segundo círculo
  @Input() thirdColor: string = '#818cf8';  // Color del tercer círculo
}
