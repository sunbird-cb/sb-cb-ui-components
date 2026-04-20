import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'd-v2-member-card',
  templateUrl: './member-card.component.html',
  styleUrls: ['./member-card.component.scss']
})
export class MemberCardComponent implements OnInit {
  @Input() memeberData: any 
  @Input() isLoading: boolean = false 
  constructor(){

  }

  ngOnInit() {
  }
}
