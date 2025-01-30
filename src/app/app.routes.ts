import { Routes } from '@angular/router';

// layouts
import { BaseLayoutComponent } from './layouts/base-layout/base-layout.component';

// guards
import { adminGuard } from './guards/admin.guard';
import { routesGuard } from './guards/routes.guard';

export const routes: Routes = [
    // Rutas públicas y sin layout aplicado
    {
        path: '',
        children: [
            { path: '', redirectTo: '/login', pathMatch: 'full' },
            { path: 'login', loadComponent: () => import('./pages/user/login/login.component').then(p => p.LoginComponent) },
            { path: 'register', loadComponent: () => import('./pages/user/register/register.component').then(p => p.RegisterComponent) },
            { path: 'recover', loadComponent: () => import('./pages/user/recover/recover.component').then(p => p.RecoverComponent) }
        ]
    },
    // Rutas protegidas y con layout aplicado
    {
        path: '',
        component: BaseLayoutComponent,
        children: [
           { path: 'panel', canActivate: [adminGuard, routesGuard], loadComponent: () => import('./pages/backoffice/backoffice.component').then(p => p.BackofficeComponent) },
           { path: 'profile', canActivate: [routesGuard], loadComponent: () => import('./pages/user/profile/profile.component').then(p => p.ProfileComponent) },
           { path: 'dashboard', /*canActivate: [routesGuard],*/ loadComponent: () => import('./pages/dashboard/dashboard.component').then(p => p.DashboardComponent)},
           { path: 'clients', canActivate: [routesGuard], loadComponent: () => import('./pages/clients/clients.component').then(p => p.ClientsComponent) },
           { path: 'orders', canActivate: [routesGuard], loadComponent: () => import('./pages/orders/orders.component').then(p => p.OrdersComponent) },
           { path: 'products', canActivate: [routesGuard], loadComponent: () => import('./pages/products/products.component').then(p => p.ProductsComponent) },
           { path: 'warranties', canActivate: [routesGuard], loadComponent: () => import('./pages/warranties/warranties.component').then(p => p.WarrantiesComponent) },
           { path: 'suppliers', canActivate: [routesGuard], loadComponent: () => import('./pages/suppliers/suppliers.component').then(p => p.SuppliersComponent) },
           { path: 'expenses', canActivate: [routesGuard], loadComponent: () => import('./pages/expenses/expenses.component').then(p => p.ExpensesComponent) },
        ]
    },

    // Ruta de error
    { path: '**', loadComponent: () => import('./pages/error/error-page/error-page.component').then(c => c.ErrorPageComponent) }
];
