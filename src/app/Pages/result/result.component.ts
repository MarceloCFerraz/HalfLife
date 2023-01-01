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

        var chart = new Chart("chart", {
            type: "line",
            data: {
                labels: ["2022", "2021", "2020", "2019"],
                datasets: [
                    {
                        label: "Numbers by year",
                        data: [15000, 11200, 10000, 1000],
                    },
                ],
            },
        });
    }
}
