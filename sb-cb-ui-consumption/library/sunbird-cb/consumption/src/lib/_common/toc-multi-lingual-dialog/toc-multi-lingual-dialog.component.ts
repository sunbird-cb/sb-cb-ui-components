import { Component, OnInit, Inject } from '@angular/core'
import { MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA, MatLegacyDialogRef as MatDialogRef } from '@angular/material/legacy-dialog'

@Component({
  selector: 'sb-uic-toc-multi-lingual-dialog',
  templateUrl: './toc-multi-lingual-dialog.component.html',
  styleUrls: ['./toc-multi-lingual-dialog.component.scss']
})

export class TOCMultiLingualDialogComponent implements OnInit{
  constructor(
    public dialogRef: MatDialogRef<TOCMultiLingualDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
  }
}
