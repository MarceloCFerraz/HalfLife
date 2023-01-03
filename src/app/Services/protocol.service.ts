import { DrugCurve } from "./../Models/DrugCurve";
import { Drug } from "src/app/Models/Drug";
import { Chart, ChartDataset, Point } from "chart.js/auto";
import { Protocol } from "./../Models/Protocol";
import { Injectable } from "@angular/core";

@Injectable({
    providedIn: "root",
})
export class ProtocolService {
    protocol!: Protocol;
    drugsCurves: DrugCurve[] = [];

    constructor() {}

    saveProtocol(protocol: Protocol) {
        this.protocol = protocol;
        console.table(this.protocol.drugs);
        this.fillDrugsCurves();
    }

    getProtocol() {
        return this.protocol;
    }

    getChart(chartName: string) {
        let chart = new Chart(chartName, {
            type: "line",
            data: {
                labels: this.drugsCurves[this.getLongestDrugIndex()].days,
                datasets: this.getDataSets(),
            },
            options: {
                plugins: {
                    legend: {
                        labels: {
                            // This more specific font property overrides the global property
                            // https://www.chartjs.org/docs/latest/general/fonts.html
                            font: {
                                family: "Rubik",
                            },
                        },
                    },
                },
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

            let drugCurve: DrugCurve = {
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

                if (
                    day > 0 &&
                    day % application_interval == 0 &&
                    day <= duration
                ) {
                    applications.push({ day: day, concentration: dosage });
                    drugCurve.days.push(day);
                }
                applications.forEach((application) => {
                    let checkDay =
                        application.day +
                        halflife *
                            Math.floor((day - application.day) / halflife);

                    if (day > 0 && day != application.day && day == checkDay) {
                        application.concentration /= 2;
                        if (day != drugCurve.days[drugCurve.days.length - 1]) {
                            drugCurve.days.push(day);
                        }
                    }
                    drugConcentration += application.concentration;
                });

                if (
                    day != 0 &&
                    day == drugCurve.days[drugCurve.days.length - 1]
                ) {
                    drugCurve.concentration.push(drugConcentration);
                }

                day += 1;
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

    getLongestDrugIndex(): number {
        let result = 0;
        let longestDrugConcentration = 0;

        for (let i = 0; i < this.drugsCurves.length; i++) {
            let curve = this.drugsCurves.at(i);
            if (
                curve != undefined &&
                curve.days[curve.days.length - 1] > longestDrugConcentration
            ) {
                let lastItemIndex = curve.days.length - 1;
                result = i;
                longestDrugConcentration = curve.days[lastItemIndex];
            }
        }

        return result;
    }
}
