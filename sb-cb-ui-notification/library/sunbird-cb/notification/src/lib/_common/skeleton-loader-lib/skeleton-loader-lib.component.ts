import { Component, Input, OnInit } from '@angular/core'

@Component({
  selector: 'sb-uic-skeleton-loader',
  templateUrl: './skeleton-loader-lib.component.html',
  styleUrls: ['./skeleton-loader-lib.component.scss'],
})
export class SkeletonLoaderLibComponent implements OnInit {

  @Input() bindingClass = ''
  @Input() height = ''
  @Input() width = ''
  constructor() { }

  ngOnInit() {
  }
}
