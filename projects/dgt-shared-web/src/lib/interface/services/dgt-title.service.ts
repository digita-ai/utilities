import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import * as _ from 'lodash';

@Injectable()
export class DGTTitleService {

  constructor(public titleService: Title) { }

  setPageTitle(pageTitle: string) {
    const currentTitle: string = this.titleService.getTitle();
    const currentTitleSplit: string[] = currentTitle.split('|');

    if (currentTitleSplit.length > 1) {
      const plannerTitle: string = _.last(currentTitleSplit).trim();

      this.titleService.setTitle(pageTitle + ' | ' + plannerTitle);
    } else {
      this.titleService.setTitle(pageTitle + ' | ' + currentTitle);
    }
  }

  setPlannerTitle(plannerTitle: string) {
    const currentTitle: string = this.titleService.getTitle();
    const currentTitleSplit: string[] = currentTitle.split('|');

    if (currentTitleSplit.length > 1) {
      const pageTitle: string = _.first(currentTitleSplit).trim();

      this.titleService.setTitle(pageTitle + ' | ' + plannerTitle);
    } else {
      this.titleService.setTitle(currentTitle + ' | ' + plannerTitle);
    }
  }

}
