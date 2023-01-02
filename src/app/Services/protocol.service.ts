import { Drug } from "src/app/Models/Drug";
import { Chart, ChartDataset, Point } from "chart.js/auto";
import { Protocol } from "./../Models/Protocol";
import { Injectable } from "@angular/core";

@Injectable({
    providedIn: "root",
})
export class ProtocolService {
    protocol!: Protocol;
    drugsCurves: any[] = [];

    constructor() {}

    saveProtocol(protocol: Protocol) {
        this.protocol = protocol;
        this.fillDrugsCurves();
    }

    getProtocol() {
        return this.protocol;
    }

    getChart(chartName: string) {
        var chart = new Chart(chartName, {
            type: "line",
            data: {
                labels: this.drugsCurves.map((curve) => curve.days),
                datasets: this.getDataSets(),
            },
        });

        return chart;
    }
    /**
     * [
     *  {
     *      name: drug name,
     *      days:  [0, 1, 2, 3, 4, ...]
     *      concentration: [250, 350, 500, ...]
     *  }
     * ]
     */
    private fillDrugsCurves() {
        this.protocol.drugs.forEach((drug) => {
            let drugConcentration = drug.dosage;
            let drugCurve = {
                name: drug.name,
                days: [0],
                concentration: [drugConcentration],
            };

            for (
                let day = 0;
                drugConcentration > 1;
                day + drug.application_interval
            ) {
                if (day > 0) {
                    drugConcentration /= 2;

                    if (day < drug.duration) {
                        drugConcentration += drug.dosage;
                    }

                    drugCurve.days.push(day);
                    drugCurve.concentration.push(drugConcentration);
                }
            }

            this.drugsCurves.push(drugCurve);
        });
    }
    getDataSets() {
        let dataset:
            | ChartDataset<"line", (number | Point | null)[]>[]
            | { label: any; data: any }[] = [];

        this.drugsCurves.forEach((drugCurve) => {
            dataset.push({
                label: drugCurve.name,
                data: drugCurve.concentration,
            });
        });

        return dataset;
    }
}
