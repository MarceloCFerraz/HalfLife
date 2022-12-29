import { Protocol } from "./../Models/Protocol";
import { Injectable } from "@angular/core";

@Injectable({
    providedIn: "root",
})
export class ProtocolService {
    protocol!: Protocol;

    constructor() {}
}
