import { Parser } from 'n3';
import { ComponentEventType, ComponentReadEvent, ComponentResponseEvent, ComponentWriteEvent } from '@digita-ai/semcom-sdk';
import {ProfileNameComponent} from '../lib/profile/profile-name.component';
import {FormElementComponent} from '../lib/forms/form-element.component';
import {CardComponent} from '../lib/cards/card.component';
import { ProfileContactComponent } from '../lib/profile/profile-contact.component';
import { ProfilePayslipComponent } from '../lib/profile/profile-payslip.component';
import { SeparatorComponent } from '../lib/separator/separator.component';
import { ListItemComponent } from '../lib/list-item/list-item.component';

customElements.define('nde-form-element', FormElementComponent);
customElements.define('nde-card', CardComponent);
customElements.define('profile-name-component', ProfileNameComponent);
customElements.define('profile-contact-component', ProfileContactComponent);
customElements.define('profile-payslip-component',  ProfilePayslipComponent);
customElements.define('dgt-seperator', SeparatorComponent);
customElements.define('list-item', ListItemComponent);

const parser = new Parser();

document.addEventListener(ComponentEventType.READ, (event: ComponentReadEvent) => {

  console.log('reading', event);

  if (!event || !event.detail || !event.detail.uri) {

    throw new Error('Argument event || !event.detail || !event.detail.uri should be set.');

  }

  fetch(event.detail.uri).then((response) => response.text().then((profileText) => {

    const quads = parser.parse(profileText);

    event.target?.dispatchEvent(new ComponentResponseEvent({
      detail: { uri: event.detail.uri, cause: event, data: quads, success: true },
    }));

  }));

});

document.addEventListener(ComponentEventType.WRITE, (event: ComponentWriteEvent) => {

  console.log('writing', event);

  if (!event || !event.detail || !event.detail.uri) {

    throw new Error('Argument event || !event.detail || !event.detail.uri should be set.');

  }

  setTimeout(() => event.target?.dispatchEvent(new ComponentResponseEvent({
    detail: { ...event.detail, cause: event, success: true },
  })), 2000);

});
