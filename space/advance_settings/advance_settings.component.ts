// Imports
import { Component } from '@angular/core';
import { DialogComponent, DialogService } from "ng2-bootstrap-modal";
import { AdvancedSettingsModel } from '../space.model';
import { AmenityService } from '../../Amenity/amenity.service';
import { ToasterService } from 'angular2-toaster/angular2-toaster';
import * as _ from "lodash";

// Component Decorator
export interface ConfirmModel {
	title: string;
	amenity: any;
	amenityName: string;
	facilitydata: any;
}

// Component Class
@Component({
	selector: 'advance-settings',
	templateUrl: './advance_settings.component.html',
	providers: [AmenityService]
})

export class AdvanceSettingsComponent extends DialogComponent<ConfirmModel, any> implements ConfirmModel {
	
	today: any;
	title: string;
	data: any;
	amenity: any;
	message: string;

	facilitydata: any;
	uniqFacility: any;
	checkboxFacility: any;
	amenityName: string = '';
	AdvancedSettingsModel = new AdvancedSettingsModel();
	

	constructor(
		dialogService: DialogService,
		public _amenityService: AmenityService,
		public _toasterService: ToasterService

	) {
		super(dialogService);
	}

	
	ngOnInit() {
		this.uniqFacility = _.uniqBy(this.facilitydata.data, 'group');
		this.AdvancedSettingsModel.group = this.uniqFacility[0].group;
		this.facilitydata.data.forEach(element => {
			if (element.group != this.AdvancedSettingsModel.group) {
				element.checked = false;
			} else {
				element.checked = true;
			}
		});
		this.today = new Date();
	}

	
	confirm() {
		this.facilitydata.data.forEach(element => {
			if (element.checked) {
				this.AdvancedSettingsModel.facilities.push({
					facilityId: element.facilityId
				});
			}
		});
		this.result = this.AdvancedSettingsModel;
		this.close();
	}
	

	onFacilityGroupChange(group) {
		this.facilitydata.data.forEach(element => {
			if (element.group != group) {
				element.checked = false;
			} else {
				element.checked = true;
			}
		});
	}

	onFacilityChecked(e, facilityObj){				
		facilityObj.checked = e.target.checked;		
	}


	closeModel() {
		this.close();
	}

}