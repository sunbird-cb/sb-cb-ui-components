import { NgModule,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WidgetDiscussionv2Component } from './widget-discussionv2.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { RouterModule } from '@angular/router'
import { MatButtonModule } from '@angular/material/button'
import { MatIconModule } from '@angular/material/icon'
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input'
import { PipesModule } from '../../_pipes/pipes.module'
import { SkeletonLoaderModule } from '../../skeleton-loader/skeleton-loader.module'
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip'
import { MatMenuModule } from '@angular/material/menu'
import { MatSnackBarModule } from '@angular/material/snack-bar'
import { MatCardModule } from '@angular/material/card'
import { MatDialogModule } from '@angular/material/dialog'
import { MatCheckboxModule } from '@angular/material/checkbox'
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { SharedModule } from '../../_shared/shared.module';
import { ImageSlidersModule } from '../image-sliders/image-sliders.module';
import { NewPostModule } from '../new-post/new-post.module';
import { PostCardModule } from '../post-card/post-card.module';



@NgModule({
  declarations: [
    WidgetDiscussionv2Component,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    PipesModule,
    SkeletonLoaderModule,
    MatMenuModule,
    MatSnackBarModule,
    MatDialogModule,
    MatCardModule,
    MatCheckboxModule,
    CKEditorModule,
    SharedModule,
    ImageSlidersModule,
    PostCardModule,
    NewPostModule
  ],
  exports: [
    WidgetDiscussionv2Component,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class WidgetDiscussionv2Module { }
