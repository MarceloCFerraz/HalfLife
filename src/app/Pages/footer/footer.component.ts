import { Router } from "@angular/router";
import { Component } from "@angular/core";

@Component({
    selector: "app-footer",
    templateUrl: "./footer.component.html",
    styleUrls: ["./footer.component.css"],
})
export class FooterComponent {
    year: number = new Date().getFullYear();

    constructor(private _router: Router) {}

    linkedIn() {
        window.open("https://www.linkedin.com/in/marcelocferrazpnz/", "_blank");
    }
    gitHub() {
        window.open("https://github.com/MarceloCFerraz", "_blank");
    }
}
