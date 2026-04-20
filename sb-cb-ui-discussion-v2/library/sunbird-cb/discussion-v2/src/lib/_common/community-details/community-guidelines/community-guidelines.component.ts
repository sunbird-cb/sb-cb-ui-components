import { Component, Input } from '@angular/core';

@Component({
  selector: 'd-v2-community-guidelines',
  templateUrl: './community-guidelines.component.html',
  styleUrls: ['./community-guidelines.component.scss']
})
export class CommunityGuidelinesComponent {
  hideCardBody:boolean | undefined
  @Input() expandCard: boolean= true
  @Input() communityGuidelines: any = []
}
