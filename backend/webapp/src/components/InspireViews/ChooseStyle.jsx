import React, { useState, useEffect } from 'react';

import StyleMap from './Map'

function ChooseStyle(props) {

    const [style_name, setStyleName] = useState(props.style_name)
    const [check_style, setCheckStyle] = useState(false)
    const [is_again, setAgain] = useState(false)
    const [invalid_feedback, setInvalidFeedback] = useState(props.invalid_feedback)

    useEffect(() => {
        setInvalidFeedback(props.invalid_feedback)
    }, [props.invalid_feedback])

    useEffect(() => {
        setStyleName(props.style_name || '')
        setAgain(false)
        setCheckStyle(false)
    }, [props.style_name])

    const handleOnChange = (e) => {
        let value = e.target.value
        setStyleName(value)
        setCheckStyle(false)
        if (!value) {
            setInvalidFeedback(true)
        }
        props.getStyleName(value)
    }

    const handleOnClick = (e) => {
        setCheckStyle(true)
    }

    const handleOnChecked = (e) => {
        let checked = e.target.checked
        setAgain(checked)
    }

    return (
        <div className="border mb-3 w-100 text-center py-2 pl-3">
            <h5 className="text-uppercase pt-2">
                {
                    props.has_view
                    ?
                        "View дахин үүсгэх"
                    :
                        "давхаргын style тохируулах"
                }
                {
                    props.has_view
                    &&
                        <input type="checkbox" className="ml-2" checked={is_again} onChange={handleOnChecked}/>
                }
            </h5>
            {
                !props.has_view || is_again
                ?
                    <div className="d-flex flex-column py-3">
                        <label className="mr-auto" htmlFor="id_styles">Style-ийн нэр:</label>
                        <select
                            className={"custom-select mr-auto w-50" + (!style_name ? ' is-invalid' : '')}
                            value={style_name ? style_name : ''}
                            id="id_styles"
                            onChange={handleOnChange}
                        >
                            <option value=''></option>
                            {
                                props.style_names.map((name, idx) =>
                                    <option value={name} key={idx}>{name}</option>
                                )
                            }
                        </select>
                        {
                            !style_name && invalid_feedback
                            &&
                                <small className="text-danger mr-auto">Style-ийн нэр хоосон байна</small>
                        }
                        <div className="mr-auto mt-3">
                            <button
                                type="button"
                                className='btn btn-primary'
                                onClick={handleOnClick}
                            >
                                Style-ийг шалгах
                            </button>
                        </div>
                        {
                            check_style
                            &&
                                <div className="pr-4 mt-3">
                                    <StyleMap
                                        style_name={style_name}
                                        view_name={props.view?.view_name}
                                        url={props.url}
                                        defualt_url={props.defualt_url}
                                        geom_type={props.geom_type}
                                    />
                                </div>
                        }
                    </div>
                :
                    null
            }
        </div>
    );
}

export default ChooseStyle;
