//import { NumericDictionary } from "lodash";

export class SpaceDataModel {
	
	buildingCode: string = '';
	bookingId: string = '';

	title: string = '';
	organizer: string = '';
	amenityId: string;

	invitedBy:string='';
	isRecurring:boolean=false;
	recurringType:number=0;
	isEveryWeekDay:boolean=false;
	recurringFrequency:number=0;
	noRecurringStartDate:any;
	noRecurringStartTime:any;
	noRecurringEndTime:any;
	recurringStartDate:any;
	recurringEndDate:any;
	recurringStartTime:any;
	recurringEndTime:any;
	recurringDayDetail:number=0;	

	notes: string= '';
	tenantId: string='';
	tenantName: string='';
	canBeBooked: boolean=false;
	bookedWith: any=[];
	advancedSettings:any;
	
}

// advancedSettings:any= {
// 	group: "",
// 	notes: "",
// 	facilities: [
// 	  {
// 		"facilityId": ""
// 	  }
// 	]
// };

export class AdvancedSettingsModel {
	group:string='';
	notes: string='';
	facilities:any= [];
}