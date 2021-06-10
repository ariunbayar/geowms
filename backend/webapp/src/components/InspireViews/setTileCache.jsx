import React, { useState, useEffect } from 'react';

function setTileCache(props) {
    const [tile_cache_check, setCheck] = useState(false)
    const [img_format, setImgFormat] = useState(props.image_format)
    const [zoom_start, setZoomStart] = useState(props.zoom_start)
    const [zoom_stop, setZoomStop] = useState(props.zoom_stop)
    const [cache_type, setCacheType] = useState(props.cache_type)
    const [number_of_cache, setNumberOfCache] = useState(props.number_of_cache)

    useEffect(() => {
        setImgFormat(props.image_format)
    }, [props.image_format])

    useEffect(() => {
        setZoomStart(props.zoom_start)
    }, [props.zoom_start])

    useEffect(() => {
        setZoomStop(props.zoom_stop)
    }, [props.zoom_stop])

    useEffect(() => {
        setCacheType(props.cache_type)
    }, [props.cache_type])

    useEffect(() => {
        setNumberOfCache(props.number_of_cache)
    }, [props.number_of_cache])

    const handleOnChange = (field, value, fn) => {
        props.getTileCacheValue(field, value)
        fn(value)
    }

    return (
        <div className="border mb-3 p-1">
            <div className="form-row col-md-12 text-center">
                <div className="form-group col-md-12">
                    <label htmlFor="" className="m-2"><h5>tilecache тохируулах</h5></label>
                    <input type="checkbox" checked={tile_cache_check} onChange={(e) => handleOnChange('tile_cache_check', e.target.checked, setCheck)}/>
                </div>
            </div>
            {
                tile_cache_check
                &&
                    <div className="form-row col-md-12">
                        <div className="form-group col-md-4">
                            <label htmlFor="" className="m-2">Зургийн формат</label>
                            <select
                                className="form-control form-control-sm"
                                value={img_format}
                                onChange={(e) => handleOnChange('image_format', e.target.value, setImgFormat)}
                            >
                                <option value="jpeg">jpeg</option>
                                <option value="png">png</option>
                            </select>
                        </div>
                        <div className="form-group col-md-4">
                                <label htmlFor="zoom_start" className="m-2">Томруулах эхний утга</label>
                                <input
                                    id="zoom_start"
                                    type="number"
                                    name='zoom_start'
                                    className={'form-control col-4' + (zoom_start > 21 ? ' is-invalid' : '')}
                                    value= {zoom_start}
                                    onChange={(e) => handleOnChange('zoom_start', e.target.value, setZoomStart)}
                                />
                                {
                                    zoom_start > 21
                                    &&
                                        <label className="text-danger">
                                            Томруулах эхний утга нь хамгийн ихдээ 21 байна
                                        </label>
                                }
                        </div>
                        <div className="form-group col-md-4">
                            <label htmlFor="zoom_stop" className="m-2">Томруулах сүүлчийн утга</label>
                            <input
                                type="number"
                                id="zoom_stop"
                                name='zoom_stop'
                                className={'form-control col-4' + (zoom_stop > 21 ? ' is-invalid' : '')}
                                value= {zoom_stop}
                                onChange={(e) => handleOnChange('zoom_stop', e.target.value, setZoomStop)}
                            />
                            {
                                zoom_stop > 21
                                &&
                                    <label className="text-danger">
                                        Томруулах сүүлчийн утга нь хамгийн ихдээ 21 байна
                                    </label>
                            }
                        </div>
                        <div className="form-group col-md-4">
                            <label htmlFor="color" className="m-2">Үйлдлийн төрөл</label>
                            <select
                                className="form-control form-control-sm"
                                value={cache_type}
                                onChange={(e) => handleOnChange('cache_type', e.target.value, setCacheType)}
                            >
                                <option value="seed">seed</option>
                                <option value="reseed">reseed</option>
                                <option value="truncate">Truncate</option>
                            </select>
                        </div>
                        <div className="form-group col-md-4 mr-2">
                            <label htmlFor="number_of_cache" className="m-2">Хэрэглэх таскуудын тоо</label>
                            <input
                                type="number"
                                id="number_of_cache"
                                name='number_of_cache'
                                className={'form-control col-4' + (zoom_stop > 100 ? ' is-invalid' : '')}
                                value= {number_of_cache}
                                onChange={(e) => handleOnChange('number_of_cache', e.target.value, setNumberOfCache)}
                            />
                            {
                                number_of_cache > 100
                                &&
                                    <label className="text-danger">
                                        Хэрэглэх таскын тоо хамгийн ихдээ 100 байна
                                    </label>
                            }
                        </div>
                    </div>
            }
        </div>
    );
}

export default setTileCache;