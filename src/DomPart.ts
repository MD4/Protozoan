import {Component} from "./Component";
import {FunctionUtils} from "./utils/FunctionUtils";

export class DomPart {
    private content:any = null;
    private html:string = '';
    private varsScope:any;
    private $element:any;
    private $parent:any;
    private root:Component;
    private attributes:any;

    constructor(root:Component, varsScope:any, $parent:any, rawPart?:any, options?:any) {
        this.root = root;
        this.varsScope = varsScope;
        this.$parent = $parent;

        var options = options || {};

        var tag = options.tag || 'div';
        this.attributes = options.attributes || {};

        this.createDomElement(rawPart, tag);
    }

    private createDomElement(rawPart:any, tag:string):void {
        this.$element = document.createElement(tag);

        if (this.attributes instanceof Function) {
            this.root.listenToVarsChanges(
                FunctionUtils.getParametersNames(this.attributes),
                this.renderAttributes.bind(this)
            );
        } else  {
            this.renderAttributes([]);
        }

        if (this.$parent) {
            this.$parent.appendChild(this.$element);
        }

        if (rawPart instanceof Component) {
            this.content = rawPart.domPart;
            this.$parent.appendChild(rawPart.domPart.$element);
        } else if (rawPart instanceof Array) {
            this.content = [];
            for (let part of rawPart) {
                let domPart:DomPart;
                if ((typeof part) === 'object' && !(part instanceof Array) && !(part instanceof Component)) {
                    domPart = new DomPart(
                        this.root,
                        this.varsScope,
                        this.$element,
                        part.content,
                        {
                            tag: part.tag,
                            attributes: part.attributes
                        }
                    );
                } else {
                    domPart = new DomPart(
                        this.root,
                        this.varsScope,
                        this.$element,
                        part
                    );
                }
                this.content.push(domPart);
                this.$element.appendChild(domPart.$element);
            }
        } else if ((typeof rawPart) === 'string') {
            this.content = rawPart;
            this.$element.innerHTML = rawPart;
        } else if ((typeof rawPart) === 'number') {
            this.content = rawPart;
            this.$element.innerHTML = rawPart;
        } else if ((typeof rawPart) === 'function') {
            this.content = rawPart;
            this.root.listenToVarsChanges(
                FunctionUtils.getParametersNames(rawPart),
                this.render.bind(this)
            );
            this.render([]);
        }
        return null;
    }

    public render(args:Array<any>):void {
        console.log('render', args);
        if ((typeof this.content) === 'function') {
            console.log(1, this.varsScope);
            this.$element.innerHTML = this.content.apply(this.varsScope, args);
        }
    }

    private renderAttributes(args:Array<any>):void {
        var attributes = this.attributes;
        if (this.attributes instanceof Function) {
            attributes = attributes.apply(this.varsScope, args);
        }
        for (let attributeName in attributes) {
            if (attributes.hasOwnProperty(attributeName)) {
                this.$element.setAttribute(attributeName, attributes[attributeName]);
            }
        }
    }
}