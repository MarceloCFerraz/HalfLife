import { ProtocolService } from "./../../Services/protocol.service";
import { Component, OnInit } from "@angular/core";
import { Chart } from "chart.js/auto";
import { Protocol } from "src/app/Models/Protocol";

@Component({
    selector: "app-result",
    templateUrl: "./result.component.html",
    styleUrls: ["./result.component.css"],
})
export class ResultComponent implements OnInit {
    protocol!: Protocol;

    constructor(private _service: ProtocolService) {}

    ngOnInit(): void {
        this.protocol = this._service.getProtocol();

        var chart = this._service.getChart("chart");
    }
}
