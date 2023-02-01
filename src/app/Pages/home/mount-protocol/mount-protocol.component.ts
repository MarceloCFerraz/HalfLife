import { Component, OnInit } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { Protocol } from "src/app/Models/Protocol";
import { ProtocolService } from "src/app/Services/protocol.service";

@Component({
    selector: "app-mount-protocol",
    templateUrl: "./mount-protocol.component.html",
    styleUrls: ["./mount-protocol.component.css", "../home.component.css"],
})
export class MountProtocolComponent implements OnInit {
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
            halfLife: ["", [Validators.required]],
            application_interval: ["", [Validators.required]],
            duration: ["", [Validators.required]],
        };
    }

    ShowResult() {
        if (this.protocolForm.valid) {
            const protocol: Protocol =
                this.protocolForm.getRawValue() as Protocol;

            this._service.saveProtocol(protocol);

            for (let i = 0; i < protocol.drugs.length; i++) {
                this.deleteDrug(i);
            }
            this._router.navigate(["/home/result"]);
        }
    }
}
