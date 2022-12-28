import { Drug } from "./Drug";

export interface Cycle {
    drugs: Drug[];
    duration: number;
}
