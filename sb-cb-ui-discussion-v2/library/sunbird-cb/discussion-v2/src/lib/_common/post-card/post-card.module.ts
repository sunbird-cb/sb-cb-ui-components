import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { RouterModule } from '@angular/router'
import { MatButtonModule } from '@angular/material/button'
import { MatIconModule } from '@angular/material/icon'
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input'
import { PipesModule } from '../../_pipes/pipes.module'
import { SkeletonLoaderModule } from '../../skeleton-loader/skeleton-loader.module'
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip'

import { MatLegacyMenuModule  as MatMenuModule } from '@angular/material/legacy-menu'
import { MatSnackBarModule } from '@angular/material/snack-bar'
import { MatCardModule } from '@angular/material/card'
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog'
import { MatCheckboxModule } from '@angular/material/checkbox'
import { SharedModule } from '../../_shared/shared.module';
import { ImageSlidersModule } from '../image-sliders/image-sliders.module';
import { PostCardComponent } from './post-card.component';
import { NewPostModule } from '../new-post/new-post.module';



@NgModule({
  declarations: [
    PostCardComponent
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
    SharedModule,
    ImageSlidersModule,
    NewPostModule
  ], 
  exports: [PostCardComponent]
})
export class PostCardModule { }
