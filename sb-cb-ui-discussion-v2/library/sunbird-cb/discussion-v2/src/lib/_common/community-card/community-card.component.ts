import { Component, Input, OnInit } from '@angular/core';
import { ConfigurationsService } from '@sunbird-cb/utils-v2';
import { MatDialog } from '@angular/material/dialog';
import { CommunityGuideLinesComponent } from '../../_shared/community-guide-lines/community-guide-lines.component';
import { UserEnrollCommunityService } from '../../_services/user-enroll-community.service';
import { DiscussionV2Service } from '../../_services/discussion-v2.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmDialogueComponent } from '../../_shared/confirm-dialogue/confirm-dialogue.component';

@Component({
  selector: 'd-v2-community-card',
  templateUrl: './community-card.component.html',
  styleUrls: ['./community-card.component.scss']
})
export class CommunityCardComponent implements OnInit {
  @Input() community: any;
  @Input() orgDetails: any = {};
  @Input() isLoading: boolean = false;
  @Input() userJoinedCommunityList: any[] = []
  defaultThumbnail
  sourceLogos
  defaultSLogo
  constructor(private snackbar: MatSnackBar, private discussV2Svc: DiscussionV2Service, private userEnrollSvc: UserEnrollCommunityService, private configSvc: ConfigurationsService, private dialog: MatDialog) { 

    const instanceConfig = this.configSvc.instanceConfig
    if (instanceConfig) {
      this.defaultThumbnail = instanceConfig.logos.defaultContent || ''
      this.sourceLogos = instanceConfig.sources
      this.defaultSLogo = instanceConfig.logos.defaultSourceLogo || ''
    } else {
      this.defaultThumbnail = '/assets/instances/eagle/app_logos/default.png'
      this.defaultSLogo =  '/assets/instances/eagle/app_logos/KarmayogiBharat_Logo.svg'
    }
  }

  ngOnInit(){
  }
  changeToDefaultImg($event: any) {
    $event.target.src = '/assets/instances/eagle/app_logos/Karmayogi_logo_icon.svg'
  }

  changeToDefaultThumbnailImg($event: any) {
    $event.target.src = this.defaultThumbnail
  }

  joinCommunity(community: any) {
    let dialogRef = this.dialog.open(CommunityGuideLinesComponent, {
      data: {
        community: community,
      },
      width: window.innerWidth <= 768 ? '100%' : '600px',
      minWidth: window.innerWidth <= 768 ? '100%' : '400px',
      maxWidth: window.innerWidth <= 768 ? '100vw' : '40vw'
    })
    dialogRef.afterClosed().subscribe((result: any) => {
      if(result) {
        this.callJoinCommunity(community)
      }
    })
  }


  callJoinCommunity(communityData: any){
    let request = {
      "communityId":communityData.communityId
    }
    this.discussV2Svc.communityJoin(request).subscribe((resData: any) => {
      
      if(resData.params && resData.params.status === 'success'){
        let resultData = [
          {
            "communityid": communityData.communityId,
            "communityName": communityData.communityName,
            "status": true
          }
        ]
        
          this.userJoinedCommunityList = [...this.userJoinedCommunityList, ...resultData];
          this.userEnrollSvc.setEnrollDataId(this.userJoinedCommunityList)
        this.manageUserCommunityStatus()

        this.snackbar.open('You\’ve successfully joined the community.')
      }
    })
  }

  async manageUserCommunityStatus(){
    this.userEnrollSvc.clearEnrollDataId()
    this.userJoinedCommunityList = await this.userEnrollSvc.getEnrollDataId()
  }

  checkCommunityPresence(communityId: string)  {
    return this.userJoinedCommunityList.some((community: any) => community.communityid === communityId);
  }
  unJoinCommunity(communityData: any){
      const confirmDialog = this.dialog.open(ConfirmDialogueComponent, {
        width: '600px',
        panelClass: 'flag-dialog',
        backdropClass: 'flag-dialog-backdrop',
        data: {
          question: 'Are you sure you want to leave the community?',
          button: {
            confirm: 'Leave',
            cancel: 'Cancel'
          },
          infoMsg:'This is a closed community, if you leave the community you wont be able to join again without the permission of SPV'
        },
      })
      confirmDialog.afterClosed().subscribe((result: any) => {
        if (result) {
          // this.deleteCommentMethod(post)
          let request = { "communityId":communityData.communityId }
          this.discussV2Svc.communityUnjoin(request).subscribe((resData: any) => {
            if(resData.params && resData.params.status === 'success'){
              const communityIndex = this.userJoinedCommunityList.findIndex((community: any) => community.communityid === communityData.communityId);
              if (communityIndex !== -1) {
                this.userJoinedCommunityList.splice(communityIndex, 1);
              }
              this.userEnrollSvc.setEnrollDataId(this.userJoinedCommunityList)
              this.manageUserCommunityStatus()
              this.snackbar.open('You\'ve successfully left the community.')
            }

          })
        }
      })
  
    
    
  }

}
