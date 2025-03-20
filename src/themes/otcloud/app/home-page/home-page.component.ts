import {
  AsyncPipe,
  NgClass,
  NgIf,
  NgTemplateOutlet,
} from '@angular/common';
import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { HomeCoarComponent } from '../../../../app/home-page/home-coar/home-coar.component';
import { ThemedHomeNewsComponent } from '../../../../app/home-page/home-news/themed-home-news.component';
import { HomePageComponent as BaseComponent } from '../../../../app/home-page/home-page.component';
import { RecentItemListComponent } from '../../../../app/home-page/recent-item-list/recent-item-list.component';
import { ThemedTopLevelCommunityListComponent } from '../../../../app/home-page/top-level-community-list/themed-top-level-community-list.component';
import { SuggestionsPopupComponent } from '../../../../app/notifications/suggestions-popup/suggestions-popup.component';
import { ThemedConfigurationSearchPageComponent } from '../../../../app/search-page/themed-configuration-search-page.component';
import { PageWithSidebarComponent } from '../../../../app/shared/sidebar/page-with-sidebar.component';
import { ViewTrackerComponent } from '../../../../app/statistics/angulartics/dspace/view-tracker.component';
import {KnowledgeWheelComponent} from "./knowledge-wheel/knowledge-wheel.component";
import {CustomSidebarComponent} from "./custom-sidebar/custom-sidebar.component";
import {RecentSubmissionsComponent} from "./recent-submissions/recent-submissions.component";

@Component({
  selector: 'ds-themed-home-page',
  styleUrls: ['../../../../app/home-page/home-page.component.scss'],
  templateUrl: './home-page.component.html',
  standalone: true,
  imports: [ThemedHomeNewsComponent, NgTemplateOutlet, NgIf, ViewTrackerComponent, ThemedTopLevelCommunityListComponent, RecentItemListComponent, AsyncPipe, TranslateModule, NgClass, SuggestionsPopupComponent, ThemedConfigurationSearchPageComponent, PageWithSidebarComponent, HomeCoarComponent, KnowledgeWheelComponent, CustomSidebarComponent, RecentSubmissionsComponent],
})
export class HomePageComponent extends BaseComponent {

}
