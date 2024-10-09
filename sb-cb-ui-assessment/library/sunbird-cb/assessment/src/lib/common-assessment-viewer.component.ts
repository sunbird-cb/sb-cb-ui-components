import { Component, Inject, OnInit } from '@angular/core'
import { MAT_DIALOG_DATA } from '@angular/material'
import { WidgetContentService } from './services/widget-content.service'
@Component({
  selector: 'lib-common-assessment-viewer',
  templateUrl: './common-assessment-viewer.component.html',
  styleUrls: ['./common-assessment-viewer.component.scss'],
})
export class CommonAssessmentViewerComponent implements OnInit {
  environment!: any
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, @Inject('environment') environment: any,
              private widgetContentService: WidgetContentService) {
    this.environment = environment
  }

  isFetchingDataComplete: any
  testData: any
  isErrorOccured: any
  quizJson: any
  fromCreation = true
  collectionId = ''
  questionPreview = false
  ngOnInit() {
    // tslint:disable-next-line
    console.log('this.data', this.data)
    if (this.data) {
      // tslint:disable-next-line
      console.log('this.data', this.data)
      this.questionPreview = this.data.questionPreview
      this.isFetchingDataComplete = this.data.isFetchingDataComplete
      this.testData = this.data.testData
      this.isErrorOccured = this.data.isErrorOccured
      this.quizJson = this.data.quizJson
      this.widgetContentService.currentMetaData = this.testData

    }
  }
}
