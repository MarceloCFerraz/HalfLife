import { ProtocolService } from "./../../Services/protocol.service";
import { Protocol } from "./../../Models/Protocol";
import { Component, OnInit } from "@angular/core";
import { Drug } from "src/app/Models/Drug";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";

@Component({
    selector: "app-home",
    templateUrl: "./home.component.html",
    styleUrls: ["./home.component.css"],
})
export class HomeComponent implements OnInit {
    protocolForm!: FormGroup;

    constructor(
        private _service: ProtocolService,
        private _formBuilder: FormBuilder,
        private _router: Router
    ) {}

    ngOnInit(): void {
        this.protocolForm = this._formBuilder.group({
            drugs: this._formBuilder.array([
                this._formBuilder.group(this.generateNewDrug()),
            ]),
        });
    }

    get drugs() {
        return this.protocolForm.controls["drugs"] as FormArray;
    }

    addDrug() {
        const drugForm = this._formBuilder.group(this.generateNewDrug());

        this.drugs.push(drugForm);
    }

    deleteDrug(drugIndex: number) {
        this.drugs.removeAt(drugIndex);
    }

    private generateNewDrug() {
        return {
            name: ["", [Validators.required]],
            dosage: ["", [Validators.required]],
            dosage_measure: ["mg", [Validators.required]],
            halflife: ["", [Validators.required]],
            halflife_measure: ["hour(s)", [Validators.required]],
            application_interval: ["", [Validators.required]],
            application_interval_measure: ["hour(s)", [Validators.required]],
            duration: ["", [Validators.required]],
            duration_measure: ["day(s)", [Validators.required]],
        };
    }

    ShowResult() {
        if (this.protocolForm.valid) {
            const protocol: Protocol =
                this.protocolForm.getRawValue() as Protocol;
            console.table(protocol.drugs);
        }
    }
}
