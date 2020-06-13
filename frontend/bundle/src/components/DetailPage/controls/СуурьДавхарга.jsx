import React, {Component} from "react"
import {Control} from 'ol/control'
import {CLASS_CONTROL, CLASS_UNSELECTABLE} from 'ol/css.js'


export class СуурьДавхарга extends Control {

    constructor(opt_options) {

        const options = opt_options || {}

        super({
            element: document.createElement('div'),
            target: options.target,
        })

        this.last_layer_callback = null

        const base_layers = options.layers.map(({thumbnail, handler, is_active}, idx) => {

            const base_layer = document.createElement('a')
            base_layer.setAttribute('href', '#')
            base_layer.className = 'суурь-давхарга'
            base_layer.style.backgroundImage = `url(${thumbnail})`
            base_layer.addEventListener('click', this.handleClick.bind(this, handler))

            handler(is_active === true)

            return base_layer

        })

        const cssClasses = `суурь-давхаргууд ${CLASS_UNSELECTABLE} ${CLASS_CONTROL}`

        const element = this.element
        element.className = cssClasses
        base_layers.forEach((l) => element.appendChild(l))

    }

    handleClick(current_layer_callback, event) {
        event.preventDefault()
        if (this.last_layer_callback)
            this.last_layer_callback(false)
        current_layer_callback(true)
        this.last_layer_callback = current_layer_callback
    }

}
