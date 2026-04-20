import { Component } from '@angular/core'

@Component({
  selector: 'ws-widget-home-top-card-competency',
  templateUrl: './card-competency.component.html',
  styleUrls: ['./card-competency.component.scss'],

})

export class HomeTopCardCompetencyComponent {
  value = 50
  bufferValue = 75

  items = [{
    name: 'Personal Details',
    value: 40,
  }, {
    name: 'Academics',
    value: 60,
  }, {
    name: 'Professional Details',
    value: 50,
  }, {
    name: 'Certification & Skills',
    value: 80,
  }]

}
