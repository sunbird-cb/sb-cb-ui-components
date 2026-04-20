import { Component, Input, OnInit } from '@angular/core';
import { NsCardContent } from '../../../_models/card-content.model';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { TOCMultiLingualDialogComponent } from '../../toc-multi-lingual-dialog/toc-multi-lingual-dialog.component';
import { ContentLanguageService } from '../../../_services/content-language.service';

@Component({
  selector: 'sb-uic-available-languages',
  templateUrl: './available-languages.component.html',
  styleUrls: ['./available-languages.component.scss']
})
export class AvailableLanguagesComponent implements OnInit {
  @Input() content!: NsCardContent.ICard;

  languageList:any[] = [];

  constructor(
    private dialog: MatDialog,
    private contentLangSvc: ContentLanguageService,
  ) {

  }

  ngOnInit(): void {
    this.languageList = [...this.contentLangSvc.getAllContentLanguages(this.content)]
  }


  openLanguageDialog(event: any): void {
    event.stopPropagation()
    this.dialog.open(TOCMultiLingualDialogComponent, {
      width: '470px',
      data: {
        title: ' ',
        from: 'availableLanguages',
        acceptButton: '',
        languageList: this.languageList

      } // optional, if you need to pass data
    });
  }

}
