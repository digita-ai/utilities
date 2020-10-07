import { NgModule, Type } from '@angular/core';
import { DGTTitleService } from './interface/services/dgt-title.service';
import { DGTPhoneValidator } from './validation/validators/dgt-phone.validator';
import { DGTCompareValidator } from './validation/validators/dgt-compare.validator';
import { DGTI8NService } from './i8n/services/dgt-i8n.service';
import { DGTSharedUtilsModule } from '@digita-ai/dgt-shared-utils';
import { DGTSharedDataModule } from '@digita-ai/dgt-shared-data';
import {
  MatPaginatorModule,
  MatTableModule,
  MatSortModule,
  MatDialogModule,
  MatButtonModule,
  MatFormFieldModule,
  MatInputModule,
  MatSelectModule,
} from '@angular/material';
import { DGTButtonComponent } from './interface/components/dgt-button/dgt-button.component';
import { DGTButtonConfirmComponent } from './interface/components/dgt-button-confirm/dgt-button-confirm.component';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient } from '@angular/common/http';
import { DGTActivitiesComponent } from './lineage/components/dgt-activities/dgt-activities.component';
import { DGTFormValidationComponent } from './form/components/dgt-form-validation/dgt-form-validation.component';
import { DGTFormControlComponent } from './form/components/dgt-form-control/dgt-form-control.component';
import { DGTFormDateComponent } from './form/components/dgt-form-date/dgt-form-date.component';
import { DGTFormElementComponent } from './form/components/dgt-form-element/dgt-form-element.component';
import { DGTFormComponent } from './form/components/dgt-form/dgt-form.component';
import { DGTFormFileComponent } from './form/components/dgt-form-file/dgt-form-file.component';
import { DGTFormLabelComponent } from './form/components/dgt-form-label/dgt-form-label.component';
import { DGTFormAfterValidator } from './form/validators/dgt-form-after.validator';
import { DGTFormBeforeValidator } from './form/validators/dgt-form-before.validator';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { DGTChipComponent } from './interface/components/dgt-chip/dgt-chip.component';
import { DGTLoadingPageComponent } from './interface/components/dgt-loading-page/dgt-loading-page.component';
import { DGTStandardPageComponent } from './interface/components/dgt-standard-page/dgt-standard-page.component';
import { DGTBrowserIsSupportedGuard } from './interface/guards/dgt-browser-is-supported.guard';
import { DGTNotificationsComponent } from './interface/components/dgt-notifications/dgt-notifications.component';
import { DGTSectionComponent } from './interface/components/dgt-section/dgt-section.component';
import { DGTSectionTitleComponent } from './interface/components/dgt-section-title/dgt-section-title.component';
import { DGTSectionContentComponent } from './interface/components/dgt-section-content/dgt-section-content.component';
import { DGTPageComponent } from './interface/components/dgt-page/dgt-page.component';
import { DGTPageContentComponent } from './interface/components/dgt-page-content/dgt-page-content.component';
import { DGTPageSidenavComponent } from './interface/components/dgt-page-sidenav/dgt-page-sidenav.component';
import { DGTPageSubHeaderComponent } from './interface/components/dgt-page-sub-header/dgt-page-sub-header.component';
import { DGTPagePaneComponent } from './interface/components/dgt-page-pane/dgt-page-pane.component';
import { DGTSectionHelpComponent } from './interface/components/dgt-section-help/dgt-section-help.component';
import { DGTSectionSummaryComponent } from './interface/components/dgt-section-summary/dgt-section-summary.component';
import { DGTSectionResetComponent } from './interface/components/dgt-section-reset/dgt-section-reset.component';
import { DGTDialogComponent } from './interface/components/dgt-dialog/dgt-dialog.component';
import { DGTDialogActionComponent } from './interface/components/dgt-dialog-action/dgt-dialog-action.component';
import { DGTDialogContentComponent } from './interface/components/dgt-dialog-content/dgt-dialog-content.component';
import { DGTLinkComponent } from './interface/components/dgt-link/dgt-link.component';
import { DGTSectionHelpTitleComponent } from './interface/components/dgt-section-help-title/dgt-section-help-title.component';
import { DGTNotificationComponent } from './interface/components/dgt-notification/dgt-notification.component';
import { DGTPageHeaderProfileComponent } from './interface/components/dgt-page-header-profile/dgt-page-header-profile.component';
import { RouterModule } from '@angular/router';
import { DGTPageRailComponent } from './interface/components/dgt-page-rail/dgt-page-rail.component';
import { DGTPageRailItemComponent } from './interface/components/dgt-page-rail-item/dgt-page-rail-item.component';
import { DGTSectionSubtitleComponent } from './interface/components/dgt-section-subtitle/dgt-section-subtitle.component';
import { DGTSectionIconComponent } from './interface/components/dgt-section-icon/dgt-section-icon.component';
import { DGTSectionActionComponent } from './interface/components/dgt-section-action/dgt-section-action.component';
import { DGTPageContentHeaderComponent } from './interface/components/dgt-page-content-header/dgt-page-content-header.component';
import { DGTPageContentHeaderSubtitleComponent } from './interface/components/dgt-page-content-header-subtitle/dgt-page-content-header-subtitle.component';
import { DGTPageContentHeaderTitleComponent } from './interface/components/dgt-page-content-header-title/dgt-page-content-header-title.component';
import { DGTPageContentGroupHeader } from './interface/components/dgt-page-content-group-header/dgt-page-content-group-header.component';
import { DGTCharmComponent } from './interface/components/dgt-charm/dgt-charm.component';
import { DGTPageHeaderTitleComponent } from './interface/components/dgt-page-header-title/dgt-page-header-title.component';
import { DGTPageHeaderComponent } from './interface/components/dgt-page-header/dgt-page-header.component';
import { DGTPageHeaderLogoComponent } from './interface/components/dgt-page-header-logo/dgt-page-header-logo.component';
import { DGTPageHeaderControlsComponent } from './interface/components/dgt-page-header-controls/dgt-page-header-controls.component';
import { DGTDataInterfaceStandardComponent } from './data/components/dgt-data-interface-standard/dgt-data-interface-standard.component';
import { DGTDataInterfaceSurveysComponent } from './data/components/dgt-data-interface-surveys/dgt-data-interface-surveys.component';
import { DGTDataValueComponent } from './data/components/dgt-data-value/dgt-data-value.component';
import { DGTDataInterfacePhoneValueComponent } from './data/components/dgt-data-interface-phone-value/dgt-data-interface-phone-value.component';
import { DGTDataInterfacePhoneComponent } from './data/components/dgt-data-interface-phone/dgt-data-interface-phone.component';
import { DGTDataInterfaceEmailComponent } from './data/components/dgt-data-interface-email/dgt-data-interface-email.component';
import { DGTDataFieldComponent } from './data/components/dgt-data-field/dgt-data-field.component';
import { DGTDataInterfaceDescentComponent } from './data/components/dgt-data-interface-descent/dgt-data-interface-descent.component';
import { DGTDataInterfaceEmailValueComponent } from './data/components/dgt-data-interface-email-value/dgt-data-interface-email-value.component';
import { DGTDataCategoryComponent } from './data/components/dgt-data-category/dgt-data-category.component';
import { DGTDataGroupComponent } from './data/components/dgt-data-group/dgt-data-group.component';
import { DGTSectionAvatarComponent } from './interface/components/dgt-section-avatar/dgt-section-avatar.component';
import { DGTSectionImageComponent } from './interface/components/dgt-section-image/dgt-section-image.component';
import { DGTDateToLabelService } from './date/services/dgt-date-to-label.service';

// export const REDUCER_TOKEN = new InjectionToken<ActionReducerMap<any>>('Registered Reducers');

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

export const declarations = [
  DGTButtonComponent,
  DGTButtonConfirmComponent,
  DGTCharmComponent,
  DGTFormValidationComponent,
  DGTFormControlComponent,
  DGTFormDateComponent,
  DGTFormElementComponent,
  DGTFormComponent,
  DGTFormFileComponent,
  DGTFormLabelComponent,
  DGTActivitiesComponent,
  DGTChipComponent,
  DGTLoadingPageComponent,
  DGTStandardPageComponent,
  DGTDialogComponent,
  DGTDialogActionComponent,
  DGTDialogContentComponent,
  DGTLinkComponent,
  DGTSectionComponent,
  DGTSectionActionComponent,
  DGTSectionAvatarComponent,
  DGTSectionImageComponent,
  DGTSectionHelpComponent,
  DGTSectionHelpTitleComponent,
  DGTSectionIconComponent,
  DGTSectionResetComponent,
  DGTSectionSummaryComponent,
  DGTSectionSubtitleComponent,
  DGTSectionTitleComponent,
  DGTSectionContentComponent,
  DGTPageComponent,
  DGTPageSubHeaderComponent,
  DGTPageSidenavComponent,
  DGTPageSubHeaderComponent,
  DGTPagePaneComponent,
  DGTPageRailComponent,
  DGTPageRailItemComponent,
  DGTPageContentComponent,
  DGTNotificationComponent,
  DGTNotificationsComponent,
  DGTPageHeaderProfileComponent,
  DGTPageHeaderTitleComponent,
  DGTPageContentHeaderComponent,
  DGTPageHeaderComponent,
  DGTPageContentHeaderSubtitleComponent,
  DGTPageContentHeaderTitleComponent,
  DGTPageContentGroupHeader,
  DGTPageHeaderLogoComponent,
  DGTPageHeaderControlsComponent,
  DGTPageHeaderTitleComponent,
  DGTDataValueComponent,
  DGTDataInterfaceSurveysComponent,
  DGTDataInterfaceStandardComponent,
  DGTDataInterfacePhoneValueComponent,
  DGTDataInterfacePhoneComponent,
  DGTDataInterfaceEmailValueComponent,
  DGTDataInterfaceEmailComponent,
  DGTDataFieldComponent,
  DGTDataInterfaceDescentComponent,
  DGTDataCategoryComponent,
  DGTDataGroupComponent,
];
export const imports: (any[] | Type<any>)[] = [
  CommonModule,
  FormsModule,
  ReactiveFormsModule,
  RouterModule,
  FlexLayoutModule,
  MatButtonModule,
  MatDialogModule,
  MatTableModule,
  MatSortModule,
  MatFormFieldModule,
  MatInputModule,
  MatPaginatorModule,
  MatSelectModule,
  DGTSharedUtilsModule,
  DGTSharedDataModule,
];
export const providers = [
  DGTTitleService,
  DGTI8NService,
  DGTPhoneValidator,
  DGTCompareValidator,
  DGTFormAfterValidator,
  DGTFormBeforeValidator,
  DGTBrowserIsSupportedGuard,
  DGTDateToLabelService,
];

@NgModule({
  declarations,
  providers,
  imports: [
    ...imports,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
  ],
  exports: [...imports, ...declarations],
})
export class DGTSharedWebModule {}
