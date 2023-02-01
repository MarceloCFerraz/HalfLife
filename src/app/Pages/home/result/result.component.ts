import { DrugInfo } from "../../../Models/DrugInfo";
import { ProtocolService } from "../../../Services/protocol.service";
import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Chart } from "chart.js/auto";
import { Protocol } from "src/app/Models/Protocol";

@Component({
    selector: "app-result",
    templateUrl: "./result.component.html",
    styleUrls: ["./result.component.css", "../home.component.css"],
})
export class ResultComponent implements OnInit {
    chart!: Chart;
    protected protocol!: Protocol;
    protected drugsInfo!: DrugInfo[];

    constructor(private _service: ProtocolService, private _router: Router) {}

    ngOnInit(): void {
        this.protocol = this._service.getProtocol();

        this.chart = this._service.getChart("chart");
        this.drugsInfo = this._service.getDrugsInfo();
    }

    returnToHome() {
        if (this.chart != undefined) {
            // TODO: figure out a way to reset graph every time
        }
        this._router.navigate([""]);
    }
}
