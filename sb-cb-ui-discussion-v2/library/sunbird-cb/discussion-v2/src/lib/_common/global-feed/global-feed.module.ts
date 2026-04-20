import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { RouterModule } from '@angular/router'
import { MatButtonModule } from '@angular/material/button'
import { MatIconModule } from '@angular/material/icon'
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input'
import { PipesModule } from '../../_pipes/pipes.module'
import { SkeletonLoaderModule } from '../../skeleton-loader/skeleton-loader.module'
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip'
import { MatLegacyProgressSpinnerModule as MatProgressSpinnerModule } from '@angular/material/legacy-progress-spinner'
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
import { GlobalFeedComponent } from './global-feed.component';
import { PostCardV2Module } from '../post-card-v2/post-card-v2.module';



@NgModule({
  declarations: [
    GlobalFeedComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
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
    NewPostModule,
    PostCardV2Module,
  ],
  exports: [GlobalFeedComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class GlobalFeedModule { }
