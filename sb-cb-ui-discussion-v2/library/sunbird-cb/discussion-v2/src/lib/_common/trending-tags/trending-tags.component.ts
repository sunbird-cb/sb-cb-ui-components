import { Component, Input } from '@angular/core';

@Component({
  selector: 'd-v2-trending-tags',
  templateUrl: './trending-tags.component.html',
  styleUrls: ['./trending-tags.component.scss']
})
export class TrendingTagsComponent {
  @Input() trendingTags: string[] = [];
  fruits = [
    { name: 'Apple', selected: true },
    { name: 'Orange', selected: false },
    { name: 'Banana', selected: true },
    { name: 'Grapes', selected: false }
  ];
}
