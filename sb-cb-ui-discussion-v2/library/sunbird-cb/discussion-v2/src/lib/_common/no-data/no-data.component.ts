import { Component, Input } from '@angular/core';

@Component({
  selector: 'd-v2-no-data',
  templateUrl: './no-data.component.html',
  styleUrls: ['./no-data.component.scss']
})
export class NoDataComponent {
  @Input() iconName: any = 'forum'
  @Input() noText: any = 'communities'

}
