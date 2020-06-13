import React, {Component} from "react"
import {Control} from 'ol/control'
import {CLASS_CONTROL, CLASS_UNSELECTABLE} from 'ol/css.js'


const CLASS_ACTIVE = 'active'


export class СуурьДавхарга extends Control {

    constructor(opt_options) {

        const options = opt_options || {}

        super({
            element: document.createElement('div'),
            target: options.target,
        })


        this.toggleLayer = this.toggleLayer.bind(this)
        this.initLayer = this.initLayer.bind(this)
        this.handleClick = this.handleClick.bind(this)

        this.last_layer = null
        this.last_layer_el = null
        this.last_active = null

        const base_layers = options.layers.map(this.initLayer)

        const cssClasses = `суурь-давхаргууд ${CLASS_UNSELECTABLE} ${CLASS_CONTROL}`

        const element = this.element
        element.className = cssClasses
        base_layers.forEach((l) => element.appendChild(l))

    }

    initLayer({thumbnail, layer, is_active}) {

        const el = document.createElement('a')
        el.setAttribute('href', '#')
        el.className = 'суурь-давхарга' + (is_active ? ' ' + CLASS_ACTIVE : '')
        el.style.backgroundImage = `url(${thumbnail})`
        el.addEventListener('click', (event) => {
            event.preventDefault()
            this.handleClick(el, layer)
        })

        this.toggleLayer(is_active === true, el, layer)

        return el

    }

    toggleLayer(is_active, el, layer) {

        if (this.last_active && is_active) {
            console.log(this.last_active);
            this.last_active.layer.setVisible(false)
            this.last_active.el.classList.toggle(CLASS_ACTIVE, false)
        }

        layer.setVisible(is_active)
        el.classList.toggle(CLASS_ACTIVE, is_active)

        if (is_active)
            this.last_active = {el, layer}
    }

    handleClick(el, layer) {
        if (this.last_active && this.last_active.el === el)
            return
        this.toggleLayer(true, el, layer)
    }

}
