import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VideoConferenceComponent } from './video-conference.component';



@NgModule({
  declarations: [
    VideoConferenceComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    VideoConferenceComponent
  ]
})
export class VideoConferenceModule { }
