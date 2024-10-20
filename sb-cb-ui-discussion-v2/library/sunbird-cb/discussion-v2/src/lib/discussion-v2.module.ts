import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { DiscussionV2Component } from './discussion-v2.component'
import { NewCommentComponent } from './_common/new-comment/new-comment.component'
import { CommentCardComponent } from './_common/comment-card/comment-card.component'
import { WidgetCommentComponent } from './_common/widget-comment/widget-comment.component'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { RouterModule } from '@angular/router'
import { MatButtonModule, MatIconModule, MatInputModule } from '@angular/material'
import { AvatarPhotoComponent } from './_common/avatar-photo/avatar-photo.component'
import { DiscussionV2Service } from './_services/discussion-v2.service'
import { PipesModule } from './_pipes/pipes.module'

@NgModule({
  declarations: [
    DiscussionV2Component,
    NewCommentComponent,
    CommentCardComponent,
    WidgetCommentComponent,
    AvatarPhotoComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    PipesModule,
  ],
  providers: [
    DiscussionV2Service,
  ],
  exports: [
    DiscussionV2Component,
    NewCommentComponent,
    CommentCardComponent,
    WidgetCommentComponent,
  ],
})
export class DiscussionV2Module { }
