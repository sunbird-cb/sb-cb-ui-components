import { ErrorParserComponent } from './../error-parser/error-parser.component'
import { Component, OnInit, Inject } from '@angular/core'
import { FormGroup, FormBuilder, Validators } from '@angular/forms'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
import { CONTENT_RESTORE } from '../../../../constants/apiEndpoints'
import { MatDialog, MatSnackBar } from '@angular/material'
import { ValueService } from '@ws-widget/utils'
import { mergeMap, catchError } from 'rxjs/operators'
import { of } from 'rxjs'
import { NOTIFICATION_TIME } from '../../../../constants/constant'
import { Notify } from '../../../../constants/notificationMessage'
import { ISearchContent } from '../../../../interface/search'
import { NotificationService } from '../../../../services/notification.service'
import { NotificationComponent } from '../notification/notification.component'
import { AccessControlService } from '../../services/access-control.service'
import { ApiService } from '../../services/api.service'

@Component({
  selector: 'ws-auth-restore-dialog',
  templateUrl: './restore-dialog.component.html',
  styleUrls: ['./restore-dialog.component.scss'],
})
export class RestoreDialogComponent implements OnInit {
  commentsForm!: FormGroup
  contentMeta!: ISearchContent
  isSubmitPressed = false
  onAction = false
  children = 0
  isNew = 'No'
  isMobile = false
  constructor(
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<RestoreDialogComponent>,
    private accessService: AccessControlService,
    @Inject(MAT_DIALOG_DATA) public data: ISearchContent,
    private apiService: ApiService,
    private notificationSvc: NotificationService,
    private valueSvc: ValueService,
  ) {
    dialogRef.disableClose = true
  }

  ngOnInit() {
    this.valueSvc.isXSmall$.subscribe(isMobile => (this.isMobile = isMobile))
    this.contentMeta = this.data
    this.children = this.contentMeta.children ? this.contentMeta.children.length : 0
    this.isNew = !(
      this.contentMeta.identifier.includes('.img') || this.contentMeta.status === 'Live'
    )
      ? 'Yes'
      : 'No'
    this.commentsForm = this.formBuilder.group({
      comments: ['', [Validators.required]],
      action: ['', [Validators.required]],
    })
  }

  submitData() {
    if (this.commentsForm.valid && this.commentsForm.value.action) {
      this.restore()
    } else {
      this.isSubmitPressed = true
    }
  }

  restore() {
    this.onAction = true
    this.apiService
      .post(`${CONTENT_RESTORE}${this.accessService.orgRootOrgAsQuery}`, {
        identifier: this.contentMeta.identifier,
        author: this.accessService.userId,
        isAdmin: this.accessService.hasRole(['editor', 'admin']),
        actorName: this.accessService.userName,
        action: 'restored',
        comment: this.commentsForm.value.comments,
      }).pipe(
        mergeMap(() =>
          this.notificationSvc
            .moveToDraft(
              this.contentMeta as any,
              this.commentsForm.value.comments,
            )
            .pipe(
              catchError(() => {
                return of({} as any)
              }),
            ),
        ),
      ).subscribe(
        () => {
          this.dialogRef.close(true)
          this.snackBar.openFromComponent(NotificationComponent, {
            data: {
              type: Notify.SUCCESS,
            },
            duration: NOTIFICATION_TIME * 1000,
          })
        },
        error => {
          this.onAction = false
          if (error.status === 409) {
            this.dialog.open(ErrorParserComponent, {
              width: this.isMobile ? '90vw' : '600px',
              height: 'auto',
              data: {
                errorFromBackendData: error.error,
              },
            })
          }
          this.snackBar.openFromComponent(NotificationComponent, {
            data: {
              type: Notify.CONTENT_FAIL,
            },
            duration: NOTIFICATION_TIME * 1000,
          })
        },
      )
  }
}