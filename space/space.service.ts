import { Injectable } from '@angular/core';
import { DataService } from './../shared/services/dataService';
import { Configuration } from './../app.constants';

@Injectable()
export class SpaceService {


	constructor(private _dataService: DataService,
		private _configuration: Configuration) { }


	
	getSpace(bookingId: string) {
		//http://dev-esd-booking-api-wi.azurewebsites.net/swagger/index.html#/
		//var apiURL = 'http://localhost:59067/api/v1/building/{code}/spacebooking/{bookingId}';
		var apiURL = this._configuration.ApiSpaceById.replace(this._configuration.buildingCode, this._configuration.BuildingCode) + bookingId;
		return this._dataService.get<any>(apiURL)
			.map(res => res);
	}


	// getVisits(data?: string) {
	// 	// var apiURL = this._configuration.apivi.replace(this._configuration.clientCode, this._configuration.ClientCode);
	// 	// return this._dataService.get<any>(apiURL + data)
	// 	// 	.map(res => res);
	// }

	// getVisit(visitId: string) {
	// 	var apiURL = this._configuration.ApiVisitById.replace(this._configuration.buildingCode, this._configuration.BuildingCode) + visitId;
	// 	//var apiURL = 'http://localhost:59067/api/v1/building/151NF/visit/' + visitId;
	// 	return this._dataService.get<any>(apiURL)
	// 		.map(res => res);
	// }

	// postVisitData(data: string) {
	// 	var apiURL = this._configuration.ApiPostVisit.replace(this._configuration.buildingCode, this._configuration.BuildingCode);
	// 	//var apiURL = 'http://localhost:59067/api/v1/building/151NF/visit';
	// 	return this._dataService.post<any>(apiURL, data)
	// 		.map(res => res);
	// }

	// putVisitData(visitId: string, data: string) {
	// 	var apiURL = this._configuration.ApiVisitById.replace(this._configuration.buildingCode, this._configuration.BuildingCode) + visitId;
	// 	//var apiURL = 'http://localhost:59067/api/v1/building/151NF/visit/' + visitId;
	// 	return this._dataService.put<any>(apiURL, data)
	// 		.map(res => res);
	// }

	// getVisitorsList(searchText: string) {
	// 	//var apiURL = this._configuration.ApiGetVisitorsList.replace(this._configuration.buildingCode, buildingCode).replace(this._configuration.visitorCode, visitorCode);
	// 	// return this._dataService.get<any>(apiURL + data)
	// 	// 	.map(res => res.data.map(item => item));
	// 	//var apiURL = this._configuration.ApiGetUserList.replace(this._configuration.buildingCode, this._configuration.BuildingCode) + '?pageNo=1&pageSize=1000&search=' + searchText + '&status=true';
	// 	var apiURL = this._configuration.ApiVisitUsers.replace(this._configuration.buildingCode, this._configuration.BuildingCode)+ '?pageNo=1&pageSize=1000&search=' + searchText;
	// 	//var apiURL = 'http://dev-esd-reporting-api-wi.azurewebsites.net/api/v1/building/151NF/visitusers?search=bh&pageNo=1&pageSize=1000';
	// 	//var apiURL = 'https://jsonplaceholder.typicode.com/posts';
	// 	return this._dataService.get<any>(apiURL)
	// 		 	.map(res => res.data.map(item => item));
	// }

	// getTenantInformation() {
	// 	var apiURL = this._configuration.ApiUserProfileBuildingWise.replace(this._configuration.buildingCode, this._configuration.BuildingCode);
	// 	return this._dataService.get<any>(apiURL)
	// 		.map(res => res);
	// }
	
    // getUpcomingVisitor(data?: string) {

    //     var apiURL = this._configuration.ApiUpcomingVisitor.replace(this._configuration.buildingCode, this._configuration.BuildingCode);
    //     return this._dataService.get<any>(apiURL + data)
    //         .map(res => res);
    // }

    // getVisitorHistory(data?: string) {

    //     var apiURL = this._configuration.ApiVisitorHistory.replace(this._configuration.buildingCode, this._configuration.BuildingCode);
    //     return this._dataService.get<any>(apiURL + data)
    //         .map(res => res);
    // }

    // getUserData(data?: string) {
    //     var apiURL = this._configuration.ApiGetUserList.replace(this._configuration.buildingCode, this._configuration.BuildingCode);

    //     return this._dataService.get<any>(apiURL + data)
    //         .map(res => res);
    // }

    // getVisitDirectory(data?: string, userId?: string) {

    //     var apiURL = this._configuration.ApiVisitDirectory.replace(this._configuration.buildingCode, this._configuration.BuildingCode);
    //     return this._dataService.get<any>(apiURL + userId + data)
    //         .map(res => res);
    // }

    // getUpcomingVisit(data?: string) {

    //     var apiURL = this._configuration.ApiUpcomingVisit.replace(this._configuration.buildingCode, this._configuration.BuildingCode);
    //     return this._dataService.get<any>(apiURL + data)
    //         .map(res => res);
    // }

    // getPastVisit(data?: string) {

    //     var apiURL = this._configuration.ApiPastVisit.replace(this._configuration.buildingCode, this._configuration.BuildingCode);
    //     return this._dataService.get<any>(apiURL + data)
    //         .map(res => res);
    // }

    // deleteVisit(visitId?: string) {
    //     var apiURL = this._configuration.ApiDeleteVisit.replace(this._configuration.buildingCode, this._configuration.BuildingCode);
    //     return this._dataService.deleteData(apiURL, visitId);
    // }
}
