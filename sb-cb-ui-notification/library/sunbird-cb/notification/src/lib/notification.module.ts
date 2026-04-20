import { NgModule } from '@angular/core';
import { NotificationComponent } from './notification.component';
import { LibNotificationsService } from './_services/lib-notifications.service';

@NgModule({
  declarations: [NotificationComponent],
  imports: [
  ],
  exports: [NotificationComponent
  ],
  providers: [LibNotificationsService]
})
export class NotificationModule { }
