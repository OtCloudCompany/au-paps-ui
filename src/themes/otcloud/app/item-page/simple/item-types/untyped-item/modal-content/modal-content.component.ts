import { Component, Input, OnInit } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'ds-modal-content',
  standalone: true,
  imports: [
    TranslateModule,
    FormsModule,
  ],
  templateUrl: './modal-content.component.html',
  styleUrl: './modal-content.component.scss',
})
export class ModalContentComponent implements OnInit {
  @Input() title!: string;
  @Input() content!: string;
  @Input() apaCitation!: string;
  @Input() chicagoCitation!: string;
  @Input() mlaCitation!: string;
  @Input() vancouverCitation!: string;
  @Input() harvardCitation!: string;
  @Input() isoCitation!: string;

  selectedCitation = 'APA';
  currentCitation!: string;

  constructor(public activeModal: NgbActiveModal) {}
  ngOnInit() {
    this.updateCitation();
  }
  updateCitation() {
    switch (this.selectedCitation) {
      case 'MLA':
        this.currentCitation = this.mlaCitation;
        break;
      case 'Chicago':
        this.currentCitation = this.chicagoCitation;
        break;
      case 'Vancouver':
        this.currentCitation = this.vancouverCitation.substring(3);
        break;
      case 'Harvard':
        this.currentCitation = this.harvardCitation;
        break;
      case 'iso690-2':
        this.currentCitation = this.isoCitation;
        break;
      case 'APA':
      default:
        this.currentCitation = this.apaCitation;
        break;
    }
  }

}
