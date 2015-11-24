import {Component} from "./Component";

var Protozoan = {
    Component: Component
};


// Exports
export = Protozoan;

if (window) {
    window['Protozoan'] = Protozoan;
}
