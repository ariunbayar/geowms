import React, { useEffect } from "react"

const CLASS_ACTIVE = 'active'

export function BaseMaps(props) {

    var element = null
    var last_active = null

    useEffect(() => {
        element = document.getElementById('base-layer')
        const base_layers = props.base_layer_controls.map(initLayer)
        base_layers.forEach((l) => element.appendChild(l))

    }, [props.base_layer_controls])

    const initLayer = ({ thumbnail_1x, thumbnail_2x, layer, is_active, name }) => {

        const el = document.createElement('a')
        el.setAttribute('href', '#')
        el.innerHTML = `<b>${name}</b>`
        el.className = 'суурь-давхарга' + (is_active ? ' ' + CLASS_ACTIVE : '')

        const img = document.createElement('img')
        img.srcset = `${thumbnail_1x} 1x, ${thumbnail_2x} 2x`
        el.appendChild(img)

        el.addEventListener('click', (event) => {
            event.preventDefault()
            handleClick(el, layer)
        })

        toggleLayer(is_active === true, el, layer)

        return el

    }

    const toggleLayer = (is_active, el, layer) => {

        if (last_active && is_active) {
            last_active.layer.setVisible(false)
            last_active.el.classList.toggle(CLASS_ACTIVE, false)
        }
        layer.setVisible(is_active)
        el.classList.toggle(CLASS_ACTIVE, is_active)

        if (is_active)
            last_active = {el, layer}
    }

    const handleClick = (el, layer) => {
        if (last_active && last_active.el === el)
            return
        toggleLayer(true, el, layer)
    }

    return (
        <div className="суурь-давхаргууд" id="base-layer"></div>
    )
}
