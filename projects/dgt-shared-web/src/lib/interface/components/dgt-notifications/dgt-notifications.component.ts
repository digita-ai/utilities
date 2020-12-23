import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DGTNotification } from '../../models/dgt-notification.model';

@Component({
  selector: 'dgt-notifications',
  templateUrl: './dgt-notifications.component.html',
  styleUrls: ['./dgt-notifications.component.css'],
})
export class DGTNotificationsComponent {

  @Input() public notifications: DGTNotification[];
  @Output() public notificationDismissed: EventEmitter<DGTNotification> = new EventEmitter<DGTNotification>();

  constructor() { }

  public onNotificationDismissed(notification: DGTNotification) {
    this.notificationDismissed.emit(notification);
  }

}
