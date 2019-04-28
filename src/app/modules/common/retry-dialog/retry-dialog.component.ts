import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

export class RetryDialogData {
    message?: string;
    code?: number;
}

@Component({
    selector: 'app-retry-dialog',
    styleUrls: ['./retry-dialog.component.scss'],
    templateUrl: './retry-dialog.component.pug',
})
export class RetryDialogComponent {
    constructor(public dialogRef: MatDialogRef<RetryDialogComponent, boolean>,
        @Inject(MAT_DIALOG_DATA) public data: RetryDialogData) { }

    public onNoClick(): void {
        this.dialogRef.close(false);
    }
}
