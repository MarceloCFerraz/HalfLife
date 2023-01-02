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
            let day = 0;
            let drugConcentration = drug.dosage;

            const application_interval = drug.application_interval;
            const halflife = drug.halfLife;
            const dosage = drug.dosage;
            const duration = drug.duration;

            let drugCurve = {
                name: drug.name,
                days: [0],
                concentration: [drugConcentration],
            };

            let applications = [
                {
                    day: 0,
                    concentration: drugConcentration,
                },
            ];

            while (drugConcentration > 1) {
                drugConcentration = 0;

                if (day % application_interval == 0 && day <= duration) {
                    applications.push({ day: day, concentration: dosage });
                }
                applications.forEach((application) => {
                    if (
                        day % halflife == 0 &&
                        (application.day + halflife) % day == 0
                    ) {
                        application.concentration /= 2;
                    }
                    drugConcentration += application.concentration;
                });

                console.info({ day, drugConcentration });
                console.table(applications);

                day += 1;
            }

            this.drugsCurves.push(drugCurve);

            console.table(this.drugsCurves);
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
