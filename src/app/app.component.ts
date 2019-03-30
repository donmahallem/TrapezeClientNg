import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSidenav, MatSidenavContainer } from '@angular/material';
import { DrawableDirective } from './drawable.directive';
import { SidebarService } from './services/sidebar.service';
@Component({
    selector: 'app-root',
    styleUrls: ['./app.component.scss'],
    templateUrl: './app.component.pug',
})
export class AppComponent implements OnInit {
    title = 'app';
    prediction: any;

    @ViewChild(MatSidenavContainer)
    sidenavContainer: MatSidenavContainer;
    @ViewChild(MatSidenav)
    sidenav: MatSidenav;
    predictions: any;
    tripId: string;
    constructor(private sidebarService: SidebarService) {

    }
    @ViewChild(DrawableDirective) canvas;
    ngOnInit() {
        this.train();
        // this.loadModel()
        this.sidebarService.statusBarObservable()
            .subscribe((open) => {
                if (open) {
                    this.sidenav.open();
                } else {
                    this.sidenav.close();
                }
            });
        this.sidenav.openedChange.subscribe((open) => {
            if (open) {
                this.sidebarService.openSidebar();
            } else {
                this.sidebarService.closeSidebar();
            }
        });
    }
    onVoted(agreed: any) {
        console.log('aa', agreed);
        this.tripId = agreed.tripId;
    }

    public toggleSidebar(): void {
        this.sidenav.toggle();
    }

    public get isSidenavOpen(): boolean {
        return this.sidenav.opened;
    }
    async train() {
        /*
        // Define a model for linear regression.
        this.linearModel = tf.sequential();
        this.linearModel.add(tf.layers.conv2d({
            filters: 64,
            strides: 2,
            kernelSize: 3,
            activation: "relu",
            inputShape: [28, 28, 1],
            padding: "same"
        }));
        this.linearModel.add(tf.layers.conv2d({
            filters: 128,
            strides: 2,
            kernelSize: 3,
            activation: "relu",
            padding: "same"
        }));
        this.linearModel.add(tf.layers.flatten());
        this.linearModel.add(tf.layers.dropout({ rate: 0.2 }))
        this.linearModel.add(tf.layers.dense({ units: 10, activation: "softmax" }));

        // Prepare the model for training: Specify the loss and the optimizer.
        this.linearModel.compile({ loss: 'meanSquaredError', optimizer: 'sgd' });

        const xs = tf.randomNormal([200, 28, 28, 1])
        const target = []
        for (let i = 0; i < 200; i++) {
            let target1 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
            const target2 = Math.floor(Math.random() * 10);
            target1[target2] = 1
            target.push(target1)
        }
        const ys = tf.tensor2d(target)//tf.randomNormal([200, 10])
        // Train
        this.linearModel.fit(xs, ys, { epochs: 10, batchSize: 32, shuffle: true })
            .then((value: any) => {
                console.log(value.history.loss)
            })

        console.log('model trained!')*/
    }

}
