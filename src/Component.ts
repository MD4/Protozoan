///<reference path="DomPart.ts"/>
import {DomPart} from "./DomPart";

export class Component {
    private template:any = {};
    private vars:Object = {};
    private container:any;
    private html:string;
    private domPart:DomPart = null;
    private listeners:Object = {};

    constructor(template:Object, container?:any) {
        this.container = container;
        this.template = template;
        this.compile();
    }

    private defineVars(templateVars:any):void {
        if (!templateVars) {
            return;
        }
        for (let v in templateVars) {
            if (templateVars.hasOwnProperty(v)) {
                this.defineVar(v, templateVars[v]);
            }
        }
    }

    private defineVar(name:string, value:any):void {
        var self = this;
        Object.defineProperty(
            this.vars,
            name,
            {
                set: function (x) {
                    this['_' + name] = x;
                    self.varChanged(name, x);
                },
                get: function () {
                    return this['_' + name];
                },
                enumerable: true,
                configurable: true
            }
        );

        this.vars[name] = value;
    }

    private varChanged(name:string, value:any):void {
        if (this.listeners[name]) {
            this.listeners[name].forEach(
                listener => listener.callback(
                    listener.parametersNames.map(
                        parameterName => this.vars[parameterName]
                    )
                )
            );
        }
    }

    listenToVarsChanges(parametersNames:Array<string>, callback:Function) {
        for (let parameter of parametersNames) {
            if (!this.listeners[parameter]) {
                this.listeners[parameter] = [];
            }
            this.listeners[parameter].push({
                callback: callback,
                parametersNames: parametersNames
            });
        }
    }

    private compile():void {
        this.domPart = new DomPart(
            this,
            this.vars,
            this.container,
            this.template.body
        );
        this.defineVars(this.template.vars);
    }
}