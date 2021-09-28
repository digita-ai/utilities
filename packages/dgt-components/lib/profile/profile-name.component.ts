import { Literal, NamedNode, Quad, Store } from 'n3';
import { css, html, property, PropertyValues, TemplateResult, unsafeCSS } from 'lit-element';
import { ComponentResponseEvent } from '@digita-ai/semcom-sdk';
import { unsafeSVG } from 'lit-html/directives/unsafe-svg';
import { Image, Theme } from '@digita-ai/dgt-theme';
import { from, Observable, of } from 'rxjs';
import { interpret, Interpreter } from 'xstate';
import { map } from 'rxjs/operators';
import { FormCleanlinessStates, FormContext, formMachine, FormRootStates, FormSubmissionStates, FormValidationStates } from '../forms/form.machine';
import { BaseComponent } from '../base/base.component';
import { FormValidatorResult } from '../forms/form-validator-result';
import { FormEvents } from '../forms/form.events';

export interface ProfileNameComponentForm {
  image: string;
  fullName: string;
  nick: string;
  honorific: string;
}

export class ProfileNameComponent extends BaseComponent {

  readonly foaf = 'http://xmlns.com/foaf/0.1/';
  readonly n = 'http://www.w3.org/2006/vcard/ns#';

  @property() image?: string;
  @property() formActor: Interpreter<FormContext<ProfileNameComponentForm>>;
  @property() canSave = false;

  /**
   * Is executed when a property value is updated.
   *
   * @param changed Map of changes properties.
   */
  update(changed: PropertyValues): void {

    super.update(changed);

    if (changed.has('entry') && this.entry) {

      this.readData(this.entry);

    }

    if(changed.has('formActor') && this.formActor){

      this.subscribe('canSave', from(this.formActor).pipe(
        map((state) => state.matches({
          [FormSubmissionStates.NOT_SUBMITTED]:{
            [FormRootStates.CLEANLINESS]: FormCleanlinessStates.DIRTY,
            [FormRootStates.VALIDATION]: FormValidationStates.VALID,
          },
        })),
      ));

    }

  }

  /**
   * Handles a response event. Can be used to update the component's properties based on the data in the response.
   *
   * @param event The response event to handle.
   */
  handleResponse(event: ComponentResponseEvent): void {

    if (!event || !event.detail || !event.detail.data) {

      throw new Error('Argument event || !event.detail || !event.detail.quads should be set.');

    }

    const store = new Store(event.detail.data);

    const fullName = store.getQuads(null,  new NamedNode(`${this.foaf}name`), null, null)[0]?.object.value;
    const nick = store.getQuads(null,  new NamedNode(`${this.foaf}nick`), null, null)[0]?.object.value;
    const honorific = store.getQuads(null, new NamedNode(`${this.n}honorific-prefix`), null, null)[0]?.object.value;
    const image = store.getQuads(null, new NamedNode(`${this.n}hasPhoto`), null, null)[0]?.object.value;
    this.image = image;

    this.formActor = interpret(formMachine<ProfileNameComponentForm>(
      /**
       * Validates the form.
       */
      (formContext): Observable<FormValidatorResult[]> => of([
        ...formContext.data.fullName ? [] : [ { field: 'fullName', message: 'Field is required' } as FormValidatorResult ],
        ...formContext.data.image ? [] : [ { field: 'image', message: 'Field is required' } as FormValidatorResult ],
        ...formContext.data.nick ? [] : [ { field: 'nick', message: 'Field is required' } as FormValidatorResult ],
        ...formContext.data.honorific ? [] : [ { field: 'honorific', message: 'Field is required' } as FormValidatorResult ],
      ]),
    )
      .withContext({
        data: { image, fullName, nick, honorific },
        original: { image, fullName, nick, honorific },
      }));

    this.formActor.start();

  }

  static get styles() {

    return [
      unsafeCSS(Theme),
      css`
        div[slot="content"] {
          display: flex;
          flex-direction: column;
        }

        div[slot="content"] > * {
          margin-bottom: var(--gap-large);
        }
      `,
    ];

  }

  private handleSave() {

    this.formActor.send(FormEvents.FORM_SUBMITTED);

    this.writeData(this.entry, [
      new Quad(new NamedNode(this.entry), new NamedNode(`${this.foaf}name`), new Literal(this.formActor.state.context.data.fullName)),
      new Quad(new NamedNode(this.entry), new NamedNode(`${this.foaf}nick`), new Literal(this.formActor.state.context.data.nick)),
      new Quad(new NamedNode(this.entry), new NamedNode(`${this.n}honorific-prefix`), new Literal(this.formActor.state.context.data.honorific)),
      new Quad(new NamedNode(this.entry), new NamedNode(`${this.n}hasPhoto`), new Literal(this.formActor.state.context.data.image)),
    ]);

  }

  render(): TemplateResult {

    return this.formActor ? html`
        
    <nde-card .showImage="${ !this.image ? false : true }">
      <div slot="title">Names</div>
      <div slot="subtitle">Your names</div>
      <div slot="icon">
        ${unsafeSVG(Image)}
      </div>
      ${this.image ? html `<img slot="image" src="${this.image}">` : ''}
      <div slot="content">
        <nde-form-element .actor="${this.formActor}" field="image">
          <label slot="label" for="image">
            Image
          </label>
          <input type="text" slot="input" name="image"/>
        </nde-form-element>
        <nde-form-element .actor="${this.formActor}" field="honorific">
          <label slot="label" for="honorific">
            Honorific
          </label>
          <input type="text" slot="input" name="honorific"/>
        </nde-form-element>
        <nde-form-element .actor="${this.formActor}" field="fullName">
          <label slot="label" for="fullName">
            Full name
          </label>
          <input type="text" slot="input" name="fullName"/>
        </nde-form-element>
        <nde-form-element .actor="${this.formActor}" field="nick">
          <label slot="label" for="nick">
            Nickname
          </label>
          <input type="text" slot="input" name="nick"/>
        </nde-form-element>
        <button class="primary" @click="${this.handleSave}" .disabled="${!this.canSave}">Save</button>
        </div>
      </nde-card>
      ` : html``;

  }

}

export default ProfileNameComponent;
