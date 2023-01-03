import { ProtocolService } from "./../../Services/protocol.service";
import { Component, ElementRef, OnInit } from "@angular/core";
import { ResolveEnd, Router } from "@angular/router";
import { Chart } from "chart.js/auto";
import { filter } from "rxjs";
import { Protocol } from "src/app/Models/Protocol";

@Component({
    selector: "app-result",
    templateUrl: "./result.component.html",
    styleUrls: ["./result.component.css"],
})
export class ResultComponent implements OnInit {
    protocol!: Protocol;
    chart: any;

    constructor(
        private _service: ProtocolService,
        private _router: Router,
        private elementRef: ElementRef
    ) {}

    ngOnInit(): void {
        this.protocol = this._service.getProtocol();

        let chart = this._service.getChart("chart");
        this.chart = chart;
    }

    returnToHome() {
        if (this.chart != undefined) {
            this.chart.destroy();
            console.info("chart destroyed");
        }
        this._router.navigate(["home"]);
    }
}
