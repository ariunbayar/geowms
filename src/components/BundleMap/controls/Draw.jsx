import React, { Component, Fragment } from "react"
import {Control} from 'ol/control'
import ReactDOM from 'react-dom'
import {CLASS_CONTROL, CLASS_HIDDEN} from 'ol/css.js'

export class DrawButton extends Control {

    constructor(opt_options) {

        const options = opt_options || {}

        super({
            element: document.createElement('div'),
            target: options.target,
        })


        const cssClasses = 'draw-button'
        const element = this.element
        element.className = cssClasses
        const elementa = document.createElement('a')
        elementa.setAttribute('href', '#')

        const elementi = document.createElement('i')
        elementi.setAttribute('aria-hidden', 'true')
        elementi.className = 'fa fa-object-ungroup'
        elementa.appendChild(elementi)

        element.addEventListener('click', (event) => {
            event.preventDefault()
            options.toggleDraw()
        })
        element.appendChild(elementa)

    }


}
