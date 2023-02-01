import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { HomeRoutingModule } from "./home-routing.module";
import { HomeComponent } from "./home.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MountProtocolComponent } from "./mount-protocol/mount-protocol.component";
import { ResultComponent } from "./result/result.component";

@NgModule({
    declarations: [HomeComponent, MountProtocolComponent, ResultComponent],
    imports: [
        CommonModule,
        HomeRoutingModule,
        FormsModule,
        ReactiveFormsModule,
    ],
})
export class HomeModule {}
