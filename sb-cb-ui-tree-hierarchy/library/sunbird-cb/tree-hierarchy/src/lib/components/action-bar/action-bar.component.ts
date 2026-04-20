import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { labels } from '../../labels/strings';

@Component({
  selector: 'lib-action-bar',
  templateUrl: './action-bar.component.html',
  styleUrls: ['./action-bar.component.scss']
})
export class ActionBarComponent implements OnInit {
  @Input() actionType:any;
  @Input() configType:any;
  @Output() sendApproval = new EventEmitter();
  @Output() closeAction = new EventEmitter();
  app_strings: any = labels;
  constructor() { }

  ngOnInit() {
  }

  SendForApproval(){
      this.sendApproval.emit('')
  }

  closeActionBar(){
    this.closeAction.emit('')
  }
  getApproveLevelText(res:any){
    if(!res) { return }
    return `Approve ${res.substr(res.lastIndexOf('_')+1,res.length)}`
  }
}
