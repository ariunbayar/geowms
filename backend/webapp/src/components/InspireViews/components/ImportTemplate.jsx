import React, { useState, useEffect } from 'react';

function ImportTemplate(props) {

    const [is_open, SetOpen] = useState(props.is_open)
    const [current_size, SetSize] = useState('')
    const [kb_or_Mb, SetSymbol] = useState('')

    useEffect(() => {
        convertFileSize(props.file)
    }, [props.file])

    const convertFileSize = (files) => {
        if (files){
            let file = files.size
            let divider = 1024
            file = file / divider
            SetSize(file.toFixed(3))
            SetSymbol('KB')
        }
    }

    const file = props.file
    return(
        <div className="border mb-3 w-100  py-2 pl-3">
            <h5 className="text-uppercase text-center pt-2">
                Feature template оруулах
                <label htmlFor="check" className="m-2" ></label>
                <input type="checkbox" id="check" checked={is_open} onChange={(e) => SetOpen(e.target.checked)} />
            </h5>
            {
                is_open &&
                    <div className='row  mt-4'>
                    <div class="custom-file col-md-6 my-auto ml-3">
                            <label class="custom-file-label" for="customFile"> {file ? file.name : "Template оруулна уу"}</label>
                            <input type="file"
                                id="customFile"
                                class="custom-file-input"
                                style={{display: 'none'}}
                                onChange={(e) => props.getFile(e)}
                            />
                        </div>
                        <div className="col-md-5 d-flex flex-column ml-4">
                            <i> файлын нэр:&nbsp; &nbsp; {file ? file.name: ''} </i>
                            <i className={kb_or_Mb == 'error' && 'text-danger'}> файлын хэмжээ: &nbsp;{file && file['name'] ? <span>{current_size} &nbsp; {kb_or_Mb}</span> : ''} </i>
                        </div>
                    </div>
            }
        </div>
    )
}

export default ImportTemplate;
