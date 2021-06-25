import {Control} from 'ol/control'

export class DownloadTemplate extends Control {

    constructor(opt_options) {

        const options = opt_options || {}
        super({
            element: document.createElement('div'),
            target: options.target,
        })


        const file = options.file
        const cssClasses = '⚙-toggle-downtemp'
        const element = this.element
        element.className = cssClasses
        const elementa = document.createElement('a')
        elementa.setAttribute('data-toggle', 'tooltip')
        elementa.setAttribute('data-placement', 'right')
        elementa.setAttribute('href', file ? file.url : "")
        elementa.setAttribute('title', file ? file.name : "Тemplate хоосон байна.")
        element.setAttribute('id', '⚙-toggle-downtemp-id')

        const elementi = document.createElement('i')
        elementi.setAttribute('aria-hidden', 'true')
        elementi.className = 'fa fa-file-text text-white'
        elementi.innerHTML = ' Татах'
        elementa.appendChild(elementi)
        element.appendChild(elementa)

    }
}

