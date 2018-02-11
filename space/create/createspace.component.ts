import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ToasterService } from 'angular2-toaster/angular2-toaster';
import { LoaderService } from '../../shared/services/loader.service';

import { Configuration } from '../../app.constants';
import { Router, ActivatedRoute } from '@angular/router';
import { debuglog, log } from 'util';
import { NgModule } from '@angular/core';
import { SpaceDataModel } from '../space.model';
import { SpaceService } from '../space.service';
import { AmenityService } from '../../Amenity/amenity.service';
import { Observable } from 'rxjs/Observable';
import * as moment from 'moment';
import { weekdays, months } from 'moment';
import { CommonModule } from "@angular/common"
import { DeleteAlertComponent } from '../../shared/modules/deletealert/deletealert.componant';
import { DialogService } from "ng2-bootstrap-modal";
import { AdvanceSettingsComponent } from '../advance_settings/advance_settings.component';
import { DataShareService } from '../../shared/services/dataShare.service';
import * as _ from "lodash";
declare var $: any;

// export interface ConfirmModel {
// 	title: string;
// 	message: string;
// 	bookingId: string;
// }
@Component({
	selector: 'create-space',
	templateUrl: './createspace.component.html',
	providers: [SpaceService, AmenityService]
})

export class CreateSpaceComponent {
	title: string;
	message: string;
	public bookingId: string;
	public spaceDataModel = new SpaceDataModel();
	public advancedSettingsModel:any = {};
	public isSubmitted: boolean = false;
	public module: string = "Space";
	public multicontacts: any;
	public multiUserImages: any;
	public weekDays: any;

	// public recurringTypes: any = [
	// 	{ "type": "Daily", "value": 0 },
	// 	{ "type": "Weekly", "value": 1 },
	// 	{ "type": "Monthly", "value": 2 }
	// ];

	private facilitydata: any;
	private amenityFacility:any;
	private amenities: any = [];
	private canBeBookedarr: any = [];
	private totalCost: number = 0;
	private checkedBookingArrCostTotal: number = 0;
	selectedAmenityObj:any;

	public dateFormat = "YYYY-MM-DD";
	public timeFormat = "HH:mm";
	private spaceDataToPost: any = {};
	private selectedAmenityName: any;
	private userData: any;

	// datepickerOpts = {
	// 	autoclose: true,
	// 	todayBtn: 'linked',
	// 	todayHighlight: true,
	// 	assumeNearbyYear: true,
	// 	format: 'dd-mm-yyyy'
	// }

	constructor(
		private _amenityService: AmenityService,
		private _spaceService: SpaceService,
		private _toasterService: ToasterService,
		private loaderService: LoaderService,
		private _configuration: Configuration,
		private route: ActivatedRoute,
		private router: Router,
		private dialogService: DialogService,
		private dataShareService:DataShareService
	) {

		this.weekDays = this._configuration.weekDays;
	}

	//@ViewChild('closeBtn') closeBtn: ElementRef;

	ngOnInit() {
		
		this.userData= this._configuration.currentUserModel;		
		let firstName = (this.userData.firstName)?this.userData.firstName+' ':'';
		let middleName = (this.userData.middleName)?this.userData.middleName+' ':'';
		let lastName = (this.userData.lastName)?this.userData.lastName:'';
		this.spaceDataModel.organizer = firstName+middleName+lastName;
		this.spaceDataModel.tenantId = this.userData.tenantId;
		this.spaceDataModel.tenantName = this.userData.tenantName;

		this.bookingId = this.route.snapshot.params['bookingId']
		if (this.bookingId != null) {
			this.getSpaceData(this.bookingId);
		} else {
			this.getAmenities();
			this.getFacilityData();
		}
	}


	private getSpaceData(bookingId) {
		if (this.bookingId != null && this.bookingId != '' && this.bookingId != undefined) {
			setTimeout(() => this.loaderService.display(true));
			this._spaceService.getSpace(bookingId).subscribe(data => {
				if (data != null) {
					this.spaceDataModel.bookingId = data.bookingId;
					this.spaceDataModel.title = (data.title) ? data.title : '';
					this.spaceDataModel.organizer = (data.organizer) ? data.organizer : '';
					this.spaceDataModel.isRecurring = data.isRecurring;
					let startDate = moment(data.startDate).format(this.dateFormat);
					let endDate = moment(data.endDate).format(this.dateFormat);
					let startTime = moment(startDate + " " + data.startTime).format(this.timeFormat);
					let endTime = moment(endDate + " " + data.endTime).format(this.timeFormat);
					let utcStartDateTime = moment.utc(startDate + ' ' + startTime);
					let utcEndDateTime = moment.utc(endDate + ' ' + endTime);
					let bookingStartDateTime = utcStartDateTime.local().format();
					let bookingEndDateTime = utcEndDateTime.local().format();

					if (!data.isRecurring) {
						this.spaceDataModel.noRecurringStartDate = new Date(bookingStartDateTime);
						this.spaceDataModel.noRecurringStartTime = new Date(bookingStartDateTime);
						this.spaceDataModel.noRecurringEndTime = new Date(bookingEndDateTime);
					}
					else {
						this.spaceDataModel.recurringStartDate = new Date(bookingStartDateTime);
						this.spaceDataModel.recurringEndDate = new Date(bookingEndDateTime);
						this.spaceDataModel.recurringStartTime = new Date(bookingStartDateTime);
						this.spaceDataModel.recurringEndTime = new Date(bookingEndDateTime);
						this.spaceDataModel.recurringType = data.recurringType;
						this.spaceDataModel.recurringFrequency = data.recurringFrequency;

						//daily for every week day
						if (data.recurringType == 0 && data.recurringFrequency == 0)
							this.spaceDataModel.isEveryWeekDay = true;
						//weekly
						if (data.recurringType == 1) {
							let selectedDays = data.recurringDayDetail.toLowerCase().split(",");
							for (var i in selectedDays) {
								let dayIndex = this.weekDays.findIndex((obj => obj.day.toLowerCase() == selectedDays[i]));
								this.weekDays[dayIndex].value = true;
							}
						}
						//monthly
						if (data.recurringType == 2 && data.recurringDayDetail != '')
							this.spaceDataModel.recurringDayDetail = Number(data.recurringDayDetail);
					}
					this.spaceDataModel.notes = data.notes;
				}
			},
				error => () => {
					this._toasterService.pop('error', 'Error', this._configuration.errorMessage);
				},
				() => {
					this.getAmenities();
					this.getFacilityData();
					this.loaderService.display(false)
				});
		}
	}



	private onSubmit(isValid) {		
			
		if (isValid) {
			if (this.bookingId == '' || this.bookingId == null || this.bookingId == undefined) {
				this.onAddData();
			} else {
				//this.onUpdateData();
			}
		}
	}

	public onAddData() {
		this.isSubmitted = true;
		setTimeout(() => this.loaderService.display(true));

		//collect only required data from model to pass in api.
		this.collectDataSave();
		console.log(this.spaceDataToPost);

		// this._spaceService.postSpaceData(JSON.stringify(this.spaceDataToPost))
		// 			.subscribe((data: any[]) => {
		// 	if (data["httpStatus"]) {
		// 		this.message = data["message"];
		// 		this._toasterService.pop('error', 'Error', this.message);
		// 	}
		// 	else {
		// 		this.message = this.module + this._configuration.msgCreated;
		// 		this._toasterService.pop('success', 'Success', this.message);
		// 		this.router.navigate(["/" + this._configuration.BuildingCode + "/space"]);
		// 	}
		// },
		// error => () => {
		// 	this._toasterService.pop('error', 'Error', this._configuration.errorMessage);
		// },
		// () => {

		// 	this.isSubmitted = false;
		// 	setTimeout(() => this.loaderService.display(false));
		// });
				
	}


	private onUpdateData() {
		this.isSubmitted = true;
		setTimeout(() => this.loaderService.display(true));

		//collect only required data from model to pass in api.
		this.collectDataSave();

		// this._spaceService.putSpaceData(this.bookingId, this.spaceDataToPost)
		// 	.subscribe((data: any[]) => {
		// 		if (data["httpStatus"]) {
		// 			this.message = data["message"];
		// 			this._toasterService.pop('error', 'Error', this.message);
		// 		}
		// 		else {
		// 			this.message = 'Space' + this._configuration.msgUpdated;
		// 			this._toasterService.pop('success', 'Success', this.message);

		// 			//this.close();
		// 			this.router.navigate(["/" + this._configuration.BuildingCode + "/space"]);
		// 		}
		// 	},
		// 	error => () => {
		// 		this._toasterService.pop('error', 'Error', this._configuration.errorMessage);
		// 	},
		// 	() => {
		// 		this.isSubmitted = false;
		// 		setTimeout(() => this.loaderService.display(false));
		// 	});
	}


	private collectDataSave() {

		this.spaceDataToPost.title = this.spaceDataModel.title;
		this.spaceDataToPost.organizer = this.spaceDataModel.organizer;
		this.spaceDataToPost.isRecurring = this.spaceDataModel.isRecurring;
		this.spaceDataToPost.notes = this.spaceDataModel.notes;
		this.spaceDataToPost.advancedSettings = this.advancedSettingsModel;

		let startDate: string = '';
		let endDate: string = '';
		let startTime: string = '';
		let endTime: string = '';

		if (!this.spaceDataModel.isRecurring) {
			startDate = moment(this.spaceDataModel.noRecurringStartDate).format(this.dateFormat);
			endDate = startDate;
			startTime = moment(this.spaceDataModel.noRecurringStartTime).format(this.timeFormat);
			endTime = moment(this.spaceDataModel.noRecurringEndTime).format(this.timeFormat);
		}
		else {
			startDate = moment(this.spaceDataModel.recurringStartDate).format(this.dateFormat);
			endDate = moment(this.spaceDataModel.recurringEndDate).format(this.dateFormat);
			startTime = moment(this.spaceDataModel.recurringStartTime).format(this.timeFormat);
			endTime = moment(this.spaceDataModel.recurringEndTime).format(this.timeFormat);
		}

		this.spaceDataToPost.startDate = startDate; //2017-01-17T00:00.000+0530Z
		this.spaceDataToPost.endDate = endDate; //2017-01-17T00:00.000+0530Z
		this.spaceDataToPost.startTime = moment(startDate + ' ' + startTime).format();//2017-01-17T07:00.000+0530Z
		this.spaceDataToPost.endTime = moment(endDate + ' ' + endTime).format();//2017-01-17T07:30.000+0530Z

		this.spaceDataToPost.recurringType = this.spaceDataModel.recurringType;
		this.spaceDataToPost.recurringFrequency = this.spaceDataModel.recurringFrequency;
		this.spaceDataToPost.recurringDayDetail = this.spaceDataModel.recurringDayDetail;

		//daily
		if (this.spaceDataModel.isRecurring && this.spaceDataModel.recurringType == 0) {
			if (this.spaceDataModel.isEveryWeekDay) {
				this.spaceDataToPost.isWeekDay = true;
				this.spaceDataToPost.recurringFrequency = 0;
			}
		}

		//weekly
		else if (this.spaceDataModel.isRecurring && this.spaceDataModel.recurringType == 1) {
			let selectedWeekDays: Array<string> = [];
			this.weekDays.forEach(element => {
				if (element.value == true) {
					selectedWeekDays.push(element.day);
				}
			});
			this.spaceDataToPost.recurringDayDetail = selectedWeekDays.join(',');
		}
	}

	private getAmenities() {
		this._amenityService.getAmenities('')
			.subscribe((data: any) => {
				if (data["httpStatus"]) {
					this.message = data["message"];
					this._toasterService.pop('error', 'Error', this.message);
				} else {
					
					var amenitiesData = data.data;
					this.canBeBookedarr = _.filter(amenitiesData, { isBookedWith: true });
					this.canBeBookedarr.forEach(element => {
						element.checked = false;						
					});
					this.amenities = _.filter(amenitiesData, { isBookable: true });
					
					this._amenityService.GetAmenityFacility(this.amenities[0].amenityId)
					.subscribe((data: any) => {						
						this.amenityFacility = data;
					},
					error => () => { },
					() => {
					});
					
					this.spaceDataModel.amenityId = this.amenities[0].amenityId;
					this.selectedAmenityName = this.amenities[0].amenityName;
					this.totalCost = this.amenities[0].cost;
					this.selectedAmenityObj = this.amenities[0];
				}
			},
			error => () => { },
			() => {
			});
	}

	private getFacilityData() {
		this._amenityService.GetBuildingFacility()
			.subscribe((data: any) => {
				this.facilitydata = data.data;
			},
			error => () => { },
			() => {
			});
	}

	// On amenity change
	private onAmenityChange(e: any, amenityId) {
		this.advancedSettingsModel = {};

		this._amenityService.GetAmenityFacility(amenityId)
		.subscribe((data: any) => {									
			this.amenityFacility = data;
		},
		error => () => { },
		() => {
		});

		var self = this;
		if (e.target != undefined && e.target.value) {
			this.selectedAmenityObj = _.find(this.amenities, function (obj) {				
				if (obj.amenityId === e.target.value) {
					self.selectedAmenityName = obj.amenityName;
					if (obj.cost) {						
						return obj.cost;
					} else {
						return true;
					}
				}
			});
		}

		if (this.canBeBookedarr.length > 0) {
			let checkedBookingArr = _.filter(this.canBeBookedarr, { checked: true });
			if (checkedBookingArr.length > 0) {
				let checkedBookingArrCost = _.map(checkedBookingArr, 'cost');
				this.checkedBookingArrCostTotal = _.sum(checkedBookingArrCost);
			}
		}
		this.totalCost = this.selectedAmenityObj.cost + this.checkedBookingArrCostTotal;

	}

	private onCanBeBookedChange(e: any) {
		if(e.target.checked==false){
			this.canBeBookedarr.forEach(element => {
				element.checked = false;						
			});					
			this.checkedBookingArrCostTotal = 0;
			this.totalCost = this.selectedAmenityObj.cost + this.checkedBookingArrCostTotal;
		}
		this.spaceDataModel.canBeBooked = e.target.checked;
	}

	private onBookedwithAmenities(e: any, amenity) {
		amenity.checked = e.target.checked;
		if (e.target.checked) {
			this.totalCost = this.totalCost + amenity.cost;
		} else {
			this.totalCost = this.totalCost - amenity.cost;
		}
	}

	public getWeekDays(e: any) {
		this.weekDays = e;
	}

	public showAdvanceSettings(amenityId: any) {
		let disposable = this.dialogService.addDialog(AdvanceSettingsComponent, {
			title: 'Advance Setting',
			amenity: amenityId,
			amenityName:this.selectedAmenityName,
			facilitydata: this.amenityFacility

		}).subscribe((result) => {
			this.advancedSettingsModel = result;
		});
	}


}
