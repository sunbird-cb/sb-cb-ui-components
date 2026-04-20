import { Component, Input } from '@angular/core';

@Component({
  selector: 'sb-uic-video-conference',
  templateUrl: './video-conference.component.html',
  styleUrls: ['./video-conference.component.scss']
})
export class VideoConferenceComponent {
  @Input() videoConf: any;
  
  joinVideoConference(joinLink: string) {
    window.open(joinLink, '_blank')
  }
}
