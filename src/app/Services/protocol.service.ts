import { DrugInfo } from "./../Models/DrugInfo";
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
                aspectRatio: 1,
                scales: {
                    x: {
                        ticks: {
                            callback: (value) => `${value} days`,
                        },
                    },
                    y: {
                        ticks: {
                            callback: (value) => `${value} mg`,
                        },
                    },
                },
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

    getDrugsInfo() {
        let drugsInfo: DrugInfo[] = [];

        this.drugsCurves.forEach((curve) => {
            let peakConcentration = this.getPeakDrugConcentration(curve);
            let peakDay = this.getPeakDrugDay(curve);

            drugsInfo.push({
                name: curve.name,
                peakConcentration: peakConcentration,
                peakDay: peakDay,
            });
        });
        return drugsInfo;
    }

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

            while (drugConcentration > 0.01) {
                drugConcentration = 0;

                if (
                    day > 0 &&
                    day % application_interval == 0 &&
                    day <= duration
                ) {
                    applications.push({ day: day, concentration: dosage });
                }
                applications.forEach((application) => {
                    let checkDay =
                        application.day +
                        halflife *
                            Math.floor((day - application.day) / halflife);

                    if (day > 0 && day != application.day && day == checkDay) {
                        application.concentration /= 2;
                    }
                    drugConcentration += application.concentration;
                });

                if (day != 0) {
                    drugCurve.days.push(day);
                    drugCurve.concentration.push(drugConcentration);
                }

                day += 1;
            }

            console.table(drugCurve);
            this.drugsCurves.push(drugCurve);
        });
    }

    private getDataSets() {
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

    private getLongestDrugIndex(): number {
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

    private getPeakDrugConcentration(curve: DrugCurve) {
        let max = curve.concentration[0];
        for (let i = 0; i < curve.concentration.length; i++) {
            let concentration = curve.concentration[i];

            if (concentration > max) {
                max = concentration;
            }
        }

        return max;
    }

    private getPeakDrugDay(curve: DrugCurve) {
        let max = curve.concentration[0];
        let day = curve.days[0];

        for (let i = 0; i < curve.concentration.length; i++) {
            let concentration = curve.concentration[i];

            if (concentration > max) {
                max = concentration;
                day = curve.days[i];
            }
        }

        return day;
    }
}
