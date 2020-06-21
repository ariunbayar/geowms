import React, {Component} from "react"
import {Control} from 'ol/control'
import {CLASS_CONTROL, CLASS_UNSELECTABLE} from 'ol/css.js'


export class CoordinateCopy extends Control {

    constructor(opt_options) {

        const options = opt_options || {}

        super({
            element: document.createElement('div'),
            target: options.target,
        })

        const cssClasses = `coordinate-copy-control ${CLASS_UNSELECTABLE} ${CLASS_CONTROL}`

        const element = this.element
        element.className = cssClasses
        //element.appendChild()

    }


}
