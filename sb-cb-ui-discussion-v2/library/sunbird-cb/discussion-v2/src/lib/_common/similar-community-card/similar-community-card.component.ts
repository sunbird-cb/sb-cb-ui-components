import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UserEnrollCommunityService } from '../../_services/user-enroll-community.service';

@Component({
  selector: 'd-v2-similar-community-card',
  templateUrl: './similar-community-card.component.html',
  styleUrls: ['./similar-community-card.component.scss']
})
export class SimilarCommunityCardComponent implements OnInit {
  hideCardBody:boolean | undefined
  @Input() expandCard: boolean= true
  @Input() communityData: any = []
  @Output() communityClick = new EventEmitter<any>();
  constructor(private userEnrollSvc: UserEnrollCommunityService ){}

  ngOnInit(): void {
      this.getSimiliarCommunities()
  }

  async getSimiliarCommunities() {
    let similarCommuninties : any = await this.userEnrollSvc.similarCommuninties()
    let userEnrolledCommunityList: any = await this.userEnrollSvc.getEnrollDataId()
    similarCommuninties.forEach((ele: any)  =>{
      userEnrolledCommunityList.some((e: any)=> ele.communityId === e.communityid)
    })
    this.communityData = similarCommuninties.filter((ele: any) => {
      return !userEnrolledCommunityList.some((e: any) => ele.communityId === e.communityid)
    })
  }

  communicityClickMethod(communityData: any){
    if(communityData) {
      this.communityClick.emit(communityData)
    }
  }
  
}
