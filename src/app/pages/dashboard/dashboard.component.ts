import { ChangeDetectorRef, Component, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ChartModule } from 'primeng/chart';

/* Mock Data */
import { mockProduct } from '../../mock/mock-products';
import { mockClients } from '../../mock/mock-clients';
import { mockOrders } from '../../mock/mock-orders';
import { mockExpenses } from '../../mock/mock-expenses';

@Component({
  selector: 'app-dashboard',
  imports: [CardModule, ChartModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  public productsData: any;
  public doughnutOptions: any;
  public clientsData: any;
  public barOptions: any;
  public ordersData: any;
  public economicsData: any;
  public economicsOptions: any;
  public earningsData: any;
  public expensesData: any;
  platformId = inject(PLATFORM_ID);

  constructor() { }

  ngOnInit(): void {
    this.initCharts();
  }

  initCharts() {
    if (isPlatformBrowser(this.platformId)) {
      const documentStyle = getComputedStyle(document.documentElement);
      const textColor = documentStyle.getPropertyValue('--text-color');
      const textColorSecondary = documentStyle.getPropertyValue('--p-text-muted-color');
      const surfaceBorder = documentStyle.getPropertyValue('--p-content-border-color');

      this.initProductsChart();
      this.initClientsChart(documentStyle, textColor, textColorSecondary, surfaceBorder);
      this.initOrdersChart(documentStyle);
      this.initEconomicsChart(textColor, textColorSecondary, surfaceBorder, documentStyle);      
    }
  }

  initProductsChart() {
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

    this.doughnutOptions = {
      plugins: {
        legend: {
          display: true,
          position: 'top',
          align: 'start',
          labels: {
            boxWidth: 15,
            padding: 10,
            usePointStyle: true,
          },
        },
      },
    };
  }

  initClientsChart(documentStyle: CSSStyleDeclaration, textColor: string, textColorSecondary: string, surfaceBorder: string) {
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

    this.barOptions = {
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
  }

  initOrdersChart(documentStyle: CSSStyleDeclaration) {
    this.ordersData = {
      labels: [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
      ],
      datasets: [
        {
          label: 'Ordenes recibidas',
          backgroundColor: [documentStyle.getPropertyValue('--p-sky-900'), documentStyle.getPropertyValue('--p-sky-800'), documentStyle.getPropertyValue('--p-sky-700'), documentStyle.getPropertyValue('--p-sky-600')],
          borderColor: [documentStyle.getPropertyValue('--p-sky-400'), documentStyle.getPropertyValue('--p-sky-400'), documentStyle.getPropertyValue('--p-sky-400'), documentStyle.getPropertyValue('--p-sky-400')],
          data: this.getOrdersData()
        }
      ]
    };
  }

  initEconomicsChart(textColor: string, textColorSecondary: string, surfaceBorder: string, documentStyle: CSSStyleDeclaration) {
    this.economicsData = {
      labels: [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
      ],
      datasets: [
        {
          label: 'Balance económico mensual',
          data: this.getEconomicsData(),
          fill: false,
          borderColor: documentStyle.getPropertyValue('--p-cyan-500'),
          tension: 0.4
        },
        {
          label: 'Ganancias mensuales',
          data: this.getEarningsData(),
          fill: false,
          borderColor: documentStyle.getPropertyValue('--p-lime-500'),
          tension: 0.4
        },
        {
          label: 'Gastos mensuales',
          data: this.getExpensesData(),
          fill: false,
          borderColor: documentStyle.getPropertyValue('--p-red-500'),
          tension: 0.4
        },
      ]
    };

    this.economicsOptions = {
      maintainAspectRatio: false,
      aspectRatio: 0.6,
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
            color: textColorSecondary
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
  }

  getProductsLabels(): Array<string> {
    const categoriesSet = new Set<string>();
    mockProduct.forEach(p => categoriesSet.add(p.category.name));
    return Array.from(categoriesSet);
  }

  getProductsData(): Array<number> {
    const categories = this.getProductsLabels();
    const stockArray: Array<number> = [];

    categories.forEach(c => {
      const totalStock = mockProduct
        .filter(p => p.category.name === c)
        .reduce((sum, p) => sum + p.stock, 0);
      stockArray.push(totalStock);
    });

    return stockArray;
  }

  getClientsData(): Array<number> {
    const clientsPerMonth: number[] = new Array(12).fill(0);

    mockClients.forEach(c => {
      const month = c.registeredDate.getMonth();
      clientsPerMonth[month]++;
    });

    return clientsPerMonth;
  }

  getOrdersData(): Array<number> {
    const ordersPerMonth: number[] = new Array(12).fill(0);

    mockOrders.forEach(o => {
      const month = o.warranty.emitedOn.getMonth();
      ordersPerMonth[month]++;
    });

    return ordersPerMonth;
  }

  getEconomicsData(): Array<number> {
    const balancePerMonth: number[] = new Array(12).fill(0);
    const earningsPerMonth: number[] = this.getEarningsData();
    const expensesPerMonth: number[] = this.getExpensesData();

    for (let index = 0; index < 12; index++) {
      balancePerMonth[index] = earningsPerMonth[index] - expensesPerMonth[index];
    }

    return balancePerMonth;
  }

  getEarningsData(): Array<number> {
    const earningsPerMonth: number[] = new Array(12).fill(0);

    mockOrders.forEach(o => {
      const month = o.warranty.emitedOn.getMonth();
      earningsPerMonth[month] += o.totalPrice;
    });

    return earningsPerMonth;
  }

  getExpensesData(): Array<number> {
    console.log(mockExpenses)
    const expensesPerMonth: number[] = new Array(12).fill(0);

    mockExpenses.forEach(e => {
      const month = e.date.getMonth();
      expensesPerMonth[month] += e.cost;     
    });

    return expensesPerMonth;
  }

  getColors(variant: string): Array<string> {
    const documentStyle = getComputedStyle(document.documentElement);
    const colors = ['100', '200', '300', '400', '500', '600', '700'];
    const backgroundColors: Array<string> = [];
    const hoverBackgroundColors: Array<string> = [];
    const categories = this.getProductsLabels();

    categories.forEach(() => {
      const rndIndex = Math.floor(Math.random() * colors.length);
      backgroundColors.push(documentStyle.getPropertyValue(`--p-sky-${colors[rndIndex]}`));
      hoverBackgroundColors.push(documentStyle.getPropertyValue(`--p-sky-${rndIndex === 0 ? '50' : colors[rndIndex - 1]}`));
    });

    return variant === 'background' ? backgroundColors : hoverBackgroundColors;
  }
}