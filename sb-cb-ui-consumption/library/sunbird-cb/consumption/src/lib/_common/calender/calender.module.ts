import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { CalenderComponent } from './calender.component';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { SkeletonLoaderLibModule } from '../skeleton-loader-lib/skeleton-loader-lib.module';
import { CalenderDayComponent } from './calender-day/calender-day.component';
import { InsiteDataService } from '../../_services/insite-data.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    MatIconModule,
    FormsModule,
    ReactiveFormsModule,
    MatSelectModule,
    SkeletonLoaderLibModule
  ],
  declarations: [CalenderComponent, CalenderDayComponent],
  exports: [CalenderComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers:[DatePipe, InsiteDataService],
})
export class CalenderModule {}