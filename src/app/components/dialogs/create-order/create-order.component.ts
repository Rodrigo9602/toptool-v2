import { Component, EventEmitter, Input, Output, OnInit, ChangeDetectorRef, Signal, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { TextareaModule } from 'primeng/textarea';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { DatePicker } from 'primeng/datepicker';
import { DividerModule } from 'primeng/divider';
import { Image, Order } from '../../../interfaces/order';
import { FloatLabel } from 'primeng/floatlabel';

import { Select } from 'primeng/select';
import { ImageUploadComponent } from '../../image-upload/image-upload.component';


import { Service } from '../../../interfaces/service';
import { Product } from '../../../interfaces/product';

import { mockProduct } from '../../../mock/mock-products';
import { mockClients } from '../../../mock/mock-clients';
import { Client } from '../../../interfaces/client';

type ClientType = 'New' | 'Old'

@Component({
  selector: 'app-order-form-modal',
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
    Select
  ],
  templateUrl: './create-order.component.html',
  providers: []
})
export class CreateOrderComponent implements OnInit {
  @Input() visible: boolean = false;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() onSave = new EventEmitter<Order>();
  public productsList: Signal<Product[]> = signal(mockProduct);
  public clientsList:Signal<Client[]> = signal(mockClients);
  public type:ClientType = 'Old'

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

  private initForm() {
    // Initialize form with complete client information based on Client interface
    this.orderForm = this.fb.group({
      client: this.fb.group({
        id: [''], // Will be generated on save
        name: ['', [Validators.required, Validators.minLength(2)]],
        lastname: ['', [Validators.required, Validators.minLength(2)]],
        ci: ['', [Validators.required, Validators.pattern(/^[0-9]+$/), Validators.minLength(11)]],
        phone: ['', [Validators.required, Validators.pattern(/^[0-9]+$/)]],
        address: ['', Validators.required],
        registeredDate: [new Date(), Validators.required]
      }),
      // Services array to handle multiple services
      services: this.fb.array([]),
      // Sells array to handle product sales
      sells: this.fb.array([]),
      // Warranty information
      warranty: this.fb.group({
        id: [''], 
        emitedOn: [new Date(), Validators.required],
        timeStamp: [new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 15), Validators.required]
      }),
      totalPrice: [0, [Validators.required, Validators.min(0)]]
    });
  }

  private createServiceFormGroup(): FormGroup {
    return this.fb.group({
      id: [''], 
      description: ['', Validators.required],
      servicesPrice: [0, [Validators.required, Validators.min(0)]],
      additionalInfo: ['']
    });
  }

  private createSellFormGroup(): FormGroup {
    return this.fb.group({
      id: [''], 
      products: this.fb.array([]),
      sellPrice: [{ value: 0, disabled: true }, [Validators.required, Validators.min(0)]]
    });
  }

  private createProductFormGroup(): FormGroup {
    return this.fb.group({
      id: ['', Validators.required],
      name: ['', Validators.required],
      description: [''],
      category: this.fb.group({
        name: ['', Validators.required]
      }),
      price: [0, [Validators.required, Validators.min(0)]],
      stock: [0, [Validators.required, Validators.min(0)]],
      imageUrl: ['']
    });
  }

  setClientType(type:ClientType):void {
    this.type = type;
  }

  // Getters for form arrays
  get services(): FormArray {
    return this.orderForm.get('services') as FormArray;
  }

  get sells(): FormArray {
    return this.orderForm.get('sells') as FormArray;
  }

  getProducts(sellIndex: number): FormArray {
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

  // Product management methods
  addProduct(sellIndex: number) {
    const products = this.getProducts(sellIndex);
    products.push(this.createProductFormGroup());
  }

  removeProduct(sellIndex: number, productIndex: number) {
    const products = this.getProducts(sellIndex);
    products.removeAt(productIndex);
    this.calculateTotalPrice();
  }

  onClientSelected(event:any) {
    const clientFounded = mockClients.find(c => c.id === event.value);
    if(clientFounded) {
      this.orderForm.patchValue({
        client: clientFounded
      })
    }
  }

  onProductSelected(sellIndex: number, productIndex: number) {
    const productGroup = this.getProducts(sellIndex).at(productIndex);
    const productId = productGroup.get('id')?.value;
    const selectedProduct = this.productsList().find(p => p.id === productId);
    
    if (selectedProduct) {
      productGroup.patchValue({
        ...selectedProduct
      });
      this.calculateTotalPrice();
    }
  }

  private calculateTotalPrice() {
    let total = 0;
    
    // Calcular total de servicios
    this.services.value.forEach((service: Service) => {
      total += Number(service.servicesPrice || 0);
    });
  
    // Calcular total de ventas
    this.sells.controls.forEach((sellGroup: AbstractControl, sellIndex: number) => {
      const sellFormGroup = sellGroup as FormGroup;
      const productsArray = sellFormGroup.get('products') as FormArray;
      let sellTotal = 0;
  
      productsArray.controls.forEach((productGroup: AbstractControl) => {
        const price = productGroup.get('price')?.value || 0;
        sellTotal += Number(price);
      });
  
      // Actualizar el sellPrice de la venta actual
      sellFormGroup.get('sellPrice')?.setValue(sellTotal, { emitEvent: false });
      total += sellTotal;
    });
  
    this.orderForm.patchValue({ totalPrice: total }, { emitEvent: false });
    this.changeDetector.detectChanges();
  }  

  saveOrder() {
    if (this.orderForm.valid) {
      const formValue = this.orderForm.getRawValue(); 
      
      const order: Order = {
        id: '4', 
        client: formValue.client,
        services: formValue.services,
        sells: formValue.sells,
        devicesImages: this.devicesImages,
        warranty: formValue.warranty,
        totalPrice: formValue.totalPrice
      };
  
      this.onSave.emit(order);
      this.hideModal();
    } else {
      this.markFormGroupTouched(this.orderForm);
    }
  }

  hideModal() {
    this.visible = false;
    this.visibleChange.emit(false);
    this.orderForm.reset();
    this.setClientType('Old');
    this.devicesImages = []; // Resetear las imágenes
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

  private setupValueChanges() {
    // Watch for changes in services and sells to update total price
    this.services.valueChanges.subscribe(() => this.calculateTotalPrice());
    this.sells.valueChanges.subscribe(() => this.calculateTotalPrice());
  }
}