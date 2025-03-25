import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { FileSectionComponent as BaseComponent } from '../../../../../../../app/item-page/simple/field-components/file-section/file-section.component';
import { slideSidebarPadding } from '../../../../../../../app/shared/animations/slide';
import { ThemedFileDownloadLinkComponent } from '../../../../../../../app/shared/file-download-link/themed-file-download-link.component';
import { ThemedLoadingComponent } from '../../../../../../../app/shared/loading/themed-loading.component';
import { MetadataFieldWrapperComponent } from '../../../../../../../app/shared/metadata-field-wrapper/metadata-field-wrapper.component';
import { VarDirective } from '../../../../../../../app/shared/utils/var.directive';
import { Bitstream } from '../../../../../../../app/core/shared/bitstream.model';

@Component({
  selector: 'ds-themed-item-page-file-section',
  templateUrl: './file-section.component.html',
  animations: [slideSidebarPadding],
  standalone: true,
  imports: [
    CommonModule,
    ThemedFileDownloadLinkComponent,
    MetadataFieldWrapperComponent,
    ThemedLoadingComponent,
    TranslateModule,
    VarDirective,
  ],
})
export class FileSectionComponent extends BaseComponent {
  getFileDescription(file: Bitstream) {
    let fileDescription: string;
    if (file?.metadata['dc.description']) {
      fileDescription = file?.metadata['dc.description'][0]['value'];
    } else {
      fileDescription = this.dsoNameService.getName(file) || 'Undefined';
    }
    return  fileDescription;
  }
}
