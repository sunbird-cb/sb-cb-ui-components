import {  CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { RouterModule } from '@angular/router'
import { MatIconModule } from '@angular/material/icon'
import { PipesModule } from './_pipes/pipes.module'
import { SkeletonLoaderModule } from './skeleton-loader/skeleton-loader.module'
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip'
import { MatLegacyProgressSpinnerModule as MatProgressSpinnerModule } from '@angular/material/legacy-progress-spinner'
import { MatMenuModule } from '@angular/material/menu'
import { MatSnackBarModule } from '@angular/material/snack-bar'
import { MatCardModule } from '@angular/material/card'
import { MatDialogModule } from '@angular/material/dialog'
import { MatCheckboxModule } from '@angular/material/checkbox'
import { PickerModule } from '@ctrl/ngx-emoji-mart'
import { WidgetDiscussionv2Module } from './_common/widget-discussionv2/widget-discussionv2.module'
import { MatListModule } from '@angular/material/list'
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular'
import { WidgetPostdetailsModule } from './_widgets/widget-postdetails/widget-postdetails.module'
import { WidgetDiscussionv2HomeModule } from './_widgets/widget-discussionv2-home/widget-discussionv2-home.module'
import { UserEnrollCommunityService } from './_services/user-enroll-community.service'
import { SharedModule } from './_shared/shared.module';


@NgModule({
  declarations: [
  
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    PipesModule,
    SkeletonLoaderModule,
    MatMenuModule,
    MatSnackBarModule,
    MatDialogModule,
    MatCardModule,
    MatCheckboxModule,
    MatListModule,
    MatSelectModule,
    MatChipsModule,
    PickerModule,
    CKEditorModule,
    SharedModule,
    WidgetDiscussionv2Module,
    WidgetPostdetailsModule,
    WidgetDiscussionv2HomeModule,
  ],
  providers: [
    UserEnrollCommunityService
  ],
  exports: [
    WidgetDiscussionv2Module,
    WidgetPostdetailsModule,
    WidgetDiscussionv2HomeModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class DiscussionV2Module { }
