import { ChangeDetectorRef, Component, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ChartModule } from 'primeng/chart';

/* Mock Data */
import { mockProduct } from '../../mock/mock-products';
import { mockClients } from '../../mock/mock-clients';

@Component({
  selector: 'app-dashboard',
  imports: [CardModule, ChartModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  public productsData: any;
  public productsOptions: any;
  public clientsData: any;
  public clientsOptions: any;
  platformId = inject(PLATFORM_ID);

  constructor(private cd: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.initCharts();

  }

  initCharts() {
    if (isPlatformBrowser(this.platformId)) {
      const documentStyle = getComputedStyle(document.documentElement);
      const textColor = documentStyle.getPropertyValue('--text-color');
      const textColorSecondary = documentStyle.getPropertyValue('--p-text-muted-color');
      const surfaceBorder = documentStyle.getPropertyValue('--p-content-border-color');

      this.productsData = {
        labels: this.getProductsLabels(),
        datasets: [
          {
            data: this.getProductsData(),
            backgroundColor: this.getColors('background'),
            hoverBackgroundColor: this.getColors('hover')
          }
        ]
      };

      this.productsOptions = {
        plugins: {
          legend: {
            labels: {
              usePointStyle: true,
              color: textColor
            }
          }
        }
      };

      this.clientsData = {
        labels: [
          'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
          'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
        ],
        datasets: [
          {
            label: 'Clientes registrados',
            backgroundColor: [documentStyle.getPropertyValue('--p-sky-900'), documentStyle.getPropertyValue('--p-sky-800'), documentStyle.getPropertyValue('--p-sky-700'), documentStyle.getPropertyValue('--p-sky-600')],
            borderColor: [documentStyle.getPropertyValue('--p-sky-400'), documentStyle.getPropertyValue('--p-sky-400'), documentStyle.getPropertyValue('--p-sky-400'), documentStyle.getPropertyValue('--p-sky-400')],
            data: this.getClientsData()
          }
        ]
      };

      this.clientsOptions = {
        maintainAspectRatio: false,
        aspectRatio: 0.8,
        plugins: {
          legend: {
            labels: {
              color: textColor
            }
          }
        },
        scales: {
          x: {
            ticks: {
              color: textColorSecondary,
              font: {
                weight: 500
              }
            },
            grid: {
              color: surfaceBorder,
              drawBorder: false
            }
          },
          y: {
            ticks: {
              color: textColorSecondary
            },
            grid: {
              color: surfaceBorder,
              drawBorder: false
            }
          }
        }
      };


      this.cd.markForCheck()
    }
  }



  getProductsLabels(): Array<String> {
    const categoriesArray: Array<String> = [];
    mockProduct.map(p => {
      if (!categoriesArray.find(c => c === p.category.name)) {
        categoriesArray.push(p.category.name)
      }
    })
    return categoriesArray;
  }

  getProductsData(): Array<number> {
    const stockArray: Array<number> = [];
    const categories = this.getProductsLabels();

    categories.map(c => {
      let total = 0;
      mockProduct.filter(p => p.category.name === c).map(e => {
        total += e.stock
      })
      stockArray.push(total)
    })

    return stockArray;
  }  

  getClientsData(): Array<number> {
    const clientsPerMonth: number[] = new Array(12).fill(0);

    mockClients.forEach(c => {
      console.log(c.registeredDate)
      const month = c.registeredDate.getMonth();
      console.log(month);
      clientsPerMonth[month]++;
    });
    console.log(clientsPerMonth)
    return clientsPerMonth;
  }

  getColors(variant: string): Array<string> {
    const documentStyle = getComputedStyle(document.documentElement);
    const colors = ['100', '200', '300', '400', '500', '600', '700'];
    const backgroundColors: Array<string> = [];
    const hoverBackgroundColors: Array<string> = [];
    const categories = this.getProductsLabels();

    categories.map(c => {
      const rndIndex = Math.ceil(Math.random() * colors.length - 1);
      backgroundColors.push(documentStyle.getPropertyValue(`--p-sky-${colors[rndIndex]}`));
      hoverBackgroundColors.push(documentStyle.getPropertyValue(`--p-sky-${rndIndex === 0 ? '50' : colors[rndIndex - 1]}`));
    })

    return variant === 'background' ? backgroundColors : hoverBackgroundColors;
  }
}
