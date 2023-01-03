import { Router } from "@angular/router";
import { Component } from "@angular/core";
import { ThisReceiver } from "@angular/compiler";

@Component({
    selector: "app-header",
    templateUrl: "./header.component.html",
    styleUrls: ["./header.component.css"],
})
export class HeaderComponent {
    /**
     *
     */
    constructor(private _router: Router) {}

    redirectHome() {
        if (this._router.url != "/result") {
            this._router.navigate(["home"]);
        }
    }
}
