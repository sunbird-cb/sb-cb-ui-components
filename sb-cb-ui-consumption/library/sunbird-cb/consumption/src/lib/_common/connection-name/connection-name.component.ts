import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NsUser } from '@sunbird-cb/utils-v2';

@Component({
  selector: 'sb-uic-connection-name',
  templateUrl: './connection-name.component.html',
  styleUrls: ['./connection-name.component.scss']
})
export class ConnectionNameComponent implements OnInit, OnChanges {
  @Input() hoverUser!: any
  @Input() showBadge = true
  @Input() showMentor = false
  me!: NsUser.IUserProfile
  useravatarName = ''
  constructor(
    private activeRoute: ActivatedRoute,
  ) {
    if (this.activeRoute.parent) {
      this.me = this.activeRoute.parent.snapshot.data.me
    }

  }

  ngOnInit() {
  }

  ngOnChanges(): void {
    if (this.hoverUser) {
      this.getUseravatarName()
    }
  }
  getUseravatarName() {
    let name = 'Guest'
    if (this.hoverUser && !this.hoverUser.personalDetails) {
      if (this.hoverUser.firstName && this.hoverUser.lastName) {
        name = `${this.hoverUser.firstName} ${this.hoverUser.lastName}`
      } else if(this.hoverUser.firstName) {
        name = `${this.hoverUser.firstName}`
      } else {
        name = `${this.hoverUser.name}`
      }
    } else if (this.hoverUser && this.hoverUser.personalDetails) {
      if (this.hoverUser.personalDetails.middlename) {
        name = `${this.hoverUser.personalDetails.firstname} ${this.hoverUser.personalDetails.middlename}`
      } else if (this.hoverUser.personalDetails.firstName) {
        name = this.hoverUser.personalDetails.firstName
      } else {
        name = this.hoverUser.personalDetails.firstname
      }

      if(this.hoverUser.personalDetails.surname) {
        name = `${name} ${this.hoverUser.personalDetails.surname}`
      }
    }
    this.useravatarName = name
  }

}
