import { NgModule, ModuleWithProviders } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateSpaceComponent } from './create/createspace.component';
import { AuthGuard } from '../shared/services/auth.guard';

export const SpaceRoutes: Routes = [
	{ path: 'add', component: CreateSpaceComponent, canActivate: [AuthGuard]},
	{ path: 'edit/:bookingId', component: CreateSpaceComponent, canActivate: [AuthGuard] }
];
//, canActivate: [AuthGuard]
export const SpaceRoute: ModuleWithProviders = RouterModule.forChild(SpaceRoutes);



