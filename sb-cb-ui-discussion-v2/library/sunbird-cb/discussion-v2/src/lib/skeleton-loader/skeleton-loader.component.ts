import { Component, Input, OnInit } from '@angular/core'

@Component({
  selector: 'd-v2-widget-skeleton-loader',
  templateUrl: './skeleton-loader.component.html',
  styleUrls: ['./skeleton-loader.component.scss'],
})
export class SkeletonLoaderComponent implements OnInit {

  @Input() bindingClass = ''
  @Input() height = ''
  @Input() width = ''
  constructor() { }

  ngOnInit() {
  }

}
