import { Component, OnInit } from "@angular/core";

@Component({
  selector: "sb-uic-access-settings",
  template: ` <p>access settings works!</p> `,
  styles: [
    `
      ::ng-deep .mdc-tooltip {
        --mdc-plain-tooltip-container-color: #616161;
        --mdc-plain-tooltip-supporting-text-color: #ffffff;
        --mdc-plain-tooltip-container-shape: 4px;
        --mdc-plain-tooltip-container-size: 340px;
        --mdc-plain-tooltip-supporting-text-padding: 8px;
      }
    `
  ]
})
export class AccessSettingsComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
