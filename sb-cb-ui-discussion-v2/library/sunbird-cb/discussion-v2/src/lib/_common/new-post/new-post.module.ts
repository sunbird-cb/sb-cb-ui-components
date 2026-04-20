import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { RouterModule } from '@angular/router'
import { MatButtonModule } from '@angular/material/button'
import { MatIconModule } from '@angular/material/icon'
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input'
import { MatLegacyAutocompleteModule as MatAutocompleteModule } from '@angular/material/legacy-autocomplete'
import { PipesModule } from '../../_pipes/pipes.module'
import { SkeletonLoaderModule } from '../../skeleton-loader/skeleton-loader.module'
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip'
import { MatLegacyProgressSpinnerModule as MatProgressSpinnerModule } from '@angular/material/legacy-progress-spinner'
import { MatMenuModule } from '@angular/material/menu'
import { MatSnackBarModule } from '@angular/material/snack-bar'
import { MatCardModule } from '@angular/material/card'
import { MatDialogModule } from '@angular/material/dialog'
import { MatCheckboxModule } from '@angular/material/checkbox'
import { SharedModule } from '../../_shared/shared.module';
import { ImageSlidersModule } from '../image-sliders/image-sliders.module';
import { NewPostComponent } from './new-post.component';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { NewPostDialogueComponent } from '../new-post-dialogue/new-post-dialogue.component';
import { PostPreviewComponent } from '../new-post-dialogue/post-preview/post-preview.component';
import { PickerModule } from '@ctrl/ngx-emoji-mart';
 
@NgModule({
  declarations: [
    NewPostComponent,
    NewPostDialogueComponent,
    PostPreviewComponent
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
    MatAutocompleteModule,
    PipesModule,
    SkeletonLoaderModule,
    MatMenuModule,
    MatSnackBarModule,
    MatDialogModule,
    MatCardModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
    CKEditorModule,
    SharedModule,
    ImageSlidersModule,
    PickerModule
  ],
  exports: [
    NewPostComponent,
    NewPostDialogueComponent,
    PostPreviewComponent
  ]
})
export class NewPostModule { }