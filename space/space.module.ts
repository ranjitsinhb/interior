import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { SpaceRoute } from './space.routing';
import { DialogService } from "ng2-bootstrap-modal";
import { TagInputModule } from 'ngx-chips';
import { CreateSpaceComponent } from './create/createspace.component';
import { NKDatetimeModule } from 'ng2-datetime/ng2-datetime';
import { EventBookingComponent } from "../shared/components/event_booking/event_booking.component";
import { AdvanceSettingsComponent } from "./advance_settings/advance_settings.component";
@NgModule({
	declarations: [
		CreateSpaceComponent,
		EventBookingComponent,
		AdvanceSettingsComponent
	],
	imports: [
		CommonModule,
		FormsModule,
		HttpModule,
		SpaceRoute,
		TagInputModule,
		NKDatetimeModule
	],
	providers: [DialogService],
	entryComponents: [AdvanceSettingsComponent],
	bootstrap: [CreateSpaceComponent]	
})
export class SpaceModule { }
