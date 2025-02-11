import { Component, Input, Output, EventEmitter, OnInit, ChangeDetectorRef, OnChanges, SimpleChanges, Signal, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { TextareaModule } from 'primeng/textarea';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { ImageUploadComponent } from '../../image-upload/image-upload.component';
import { LoadingComponent } from '../../loading/loading.component';
import { DatePicker } from 'primeng/datepicker';
import { DividerModule } from 'primeng/divider';
import { Image, Order } from '../../../interfaces/order';
import { FloatLabel } from 'primeng/floatlabel';
import { Select } from 'primeng/select';
import { mockProduct } from '../../../mock/mock-products';
import { Product } from '../../../interfaces/product';
import { Service } from '../../../interfaces/service';
import { Sell } from '../../../interfaces/sell';

@Component({
  selector: 'app-edit-order',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DialogModule,
    ButtonModule,
    InputTextModule,
    InputNumberModule,    
    DatePicker,
    DividerModule,
    FloatLabel,
    TextareaModule,
    ImageUploadComponent,
    LoadingComponent,
    Select
  ],
  templateUrl: './edit-order.component.html',
  providers: []
})
export class EditOrderComponent implements OnInit, OnChanges {
  @Input() visible: boolean = false;
  @Input() order: Order | null = null;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() onUpdate = new EventEmitter<Order>();

  
  
  // Using signal for reactive product list
  public productsList: Signal<Product[]> = signal(mockProduct);

  orderForm: FormGroup;
  devicesImages: Image[] = [];

  constructor(
    private fb: FormBuilder,    
    private changeDetector: ChangeDetectorRef
  ) {
    this.orderForm = this.fb.group({});
  }

  ngOnInit() {    
    this.initForm();
    this.setupValueChanges();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['order'] && this.order) {
      // Reset form before loading new data
      this.initForm();
      this.loadExistingData();
    }
  }

  private initForm() {
    // Initialize the form with the complete structure matching the Order interface
    this.orderForm = this.fb.group({
      client: this.fb.group({
        id: [''],
        name: ['', [Validators.required, Validators.minLength(2)]],
        lastname: ['', [Validators.required, Validators.minLength(2)]],
        ci: ['', [Validators.required, Validators.pattern(/^[0-9]+$/), Validators.minLength(11)]],
        phone: [''],
        address: [''],
        registeredDate: [new Date()]
      }),
      services: this.fb.array([]),
      sells: this.fb.array([]),
      warranty: this.fb.group({
        id: [''],
        emitedOn: [new Date(), Validators.required],
        timeStamp: [new Date(), Validators.required]
      }),      
      totalPrice: [0, [Validators.required, Validators.min(0)]]
    });
  }

  private loadExistingData() {
    if (!this.order) return;    
    // Load client data
    const clientData = {
      ...this.order.client,
      registeredDate: new Date(this.order.client.registeredDate)
    };
    this.orderForm.get('client')?.patchValue(clientData);

    // Load warranty data
    const warrantyData = {
      ...this.order.warranty,
      emitedOn: new Date(this.order.warranty.emitedOn),
      timeStamp: new Date(this.order.warranty.timeStamp)
    };
    this.orderForm.get('warranty')?.patchValue(warrantyData);

    // Load services
    const servicesArray = this.orderForm.get('services') as FormArray;
    servicesArray.clear();
    if (this.order.services) {
      this.order.services.forEach(service => {
        const serviceGroup = this.createServiceFormGroup();
        serviceGroup.patchValue({
          id: service.id,
          description: service.description,
          servicesPrice: service.servicesPrice,
          additionalInfo: service.additionalInfo
        });
        servicesArray.push(serviceGroup);
      });
    }

    // Load sells
    const sellsArray = this.orderForm.get('sells') as FormArray;
    sellsArray.clear();
    if (this.order.sells) {
      this.order.sells.forEach(sell => {
        const sellGroup = this.createSellFormGroup();
        sellGroup.patchValue({
          id: sell.id,
          sellPrice: sell.sellPrice
        });

        // Load products for each sell
        if (sell.products) {
          sell.products.forEach(product => {
            const productsArray = sellGroup.get('products') as FormArray;
            const productGroup = this.createProductFormGroup();
            productGroup.patchValue({
              productId: product.id,
              name: product.name,
              price: product.price,
              description: product.description,
              category: product.category,
              stock: product.stock,
              imageUrl: product.imageUrl
            });
            productsArray.push(productGroup);
          });
        }
        
        sellsArray.push(sellGroup);
      });
    }

    // cargar imagenes en caso de existir
    this.devicesImages = this.order.devicesImages || [];

    // Update total price
    this.orderForm.patchValue({
      totalPrice: this.order.totalPrice
    });

    this.calculateTotalPrice(); 
    
  }

  private createServiceFormGroup() {
    return this.fb.group({
      id: [''],
      description: ['', Validators.required],
      servicesPrice: [0, [Validators.required, Validators.min(0)]],
      additionalInfo: ['']
    });
  }

  private createSellFormGroup() {
    return this.fb.group({
      id: [''],
      products: this.fb.array([]),
      sellPrice: [0, [Validators.required, Validators.min(0)]]
    });
  }

  private createProductFormGroup() {
    return this.fb.group({
      productId: ['', Validators.required],
      name: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0)]],
      description: [''],
      category: this.fb.group({
        name: ['']
      }),
      stock: [0],
      imageUrl: ['']
    });
  }

  // Getters for form arrays
  get services() {
    return this.orderForm.get('services') as FormArray;
  }

  get sells() {
    return this.orderForm.get('sells') as FormArray;
  }

  getSellProducts(sellIndex: number) {
    return this.sells.at(sellIndex).get('products') as FormArray;
  }

  // Service management methods
  addService() {
    this.services.push(this.createServiceFormGroup());
  }

  removeService(index: number) {
    this.services.removeAt(index);
    this.calculateTotalPrice();
  }

  // Sell management methods
  addSell() {
    this.sells.push(this.createSellFormGroup());
  }

  removeSell(index: number) {
    this.sells.removeAt(index);
    this.calculateTotalPrice();
  }

  // Product management within sells
  addProductToSell(sellIndex: number) {
    const products = this.getSellProducts(sellIndex);
    products.push(this.createProductFormGroup());
  }

  removeProductFromSell(sellIndex: number, productIndex: number) {
    const products = this.getSellProducts(sellIndex);
    products.removeAt(productIndex);
    this.updateSellPrice(sellIndex);
    this.calculateTotalPrice();
  }

  onProductSelected(sellIndex: number, productIndex: number) {
    const productsArray = this.getSellProducts(sellIndex);
    const productGroup = productsArray.at(productIndex);
    const productId = productGroup.get('productId')?.value;
    const selectedProduct = this.productsList().find(p => p.id === productId);
    
    if (selectedProduct) {
      productGroup.patchValue({
        price: selectedProduct.price,
        name: selectedProduct.name,
        description: selectedProduct.description,
        category: selectedProduct.category,
        stock: selectedProduct.stock,
        imageUrl: selectedProduct.imageUrl
      });
      
      this.updateSellPrice(sellIndex);
    }
  }

  private updateSellPrice(sellIndex: number) {
    const sellGroup = this.sells.at(sellIndex);
    const products = sellGroup.get('products')?.value || [];
    const total = products.reduce((acc: number, product: any) => acc + Number(product.price || 0), 0);
    sellGroup.patchValue({ sellPrice: total });
    this.calculateTotalPrice();
  }

  private calculateTotalPrice() {
    let total = 0;
    
    // Sum services prices
    this.services.value.forEach((service: Service) => {
      total += Number(service.servicesPrice || 0);
    });
  
    // Sum sell prices
    this.sells.value.forEach((sell: Sell) => {
      total += Number(sell.sellPrice || 0);
    });
  
    this.orderForm.patchValue({ totalPrice: total }, { emitEvent: false });
    this.changeDetector.detectChanges();
  }

  // Form submission and validation
  updateOrder() {
    this.markFormGroupTouched(this.orderForm);   
    if (this.orderForm.valid) {
      const formValue = this.orderForm.value;
      const updatedOrder: Order = {
        ...this.order,
        ...formValue,
        id: this.order?.id,
        devicesImages: this.devicesImages
      };
      this.onUpdate.emit(updatedOrder);
      this.hideModal();
    } else {
      console.log('Error en edición:', this.orderForm.errors);      
    }
  }

  private setupValueChanges() {
    // Watch for changes in services and sells to update total price
    this.services.valueChanges.subscribe(() => this.calculateTotalPrice());
    this.sells.valueChanges.subscribe(() => this.calculateTotalPrice());
  }



  hideModal() {
    this.visible = false;
    this.visibleChange.emit(false);
    this.orderForm.reset();
    this.devicesImages = []; 
    this.initForm();
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();

      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
      
      if (control instanceof FormArray) {
        control.controls.forEach(c => {
          if (c instanceof FormGroup) {
            this.markFormGroupTouched(c);
          }
        });
      }
    });
  }
}