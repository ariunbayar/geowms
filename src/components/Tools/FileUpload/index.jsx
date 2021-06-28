import React, { useState, useEffect } from 'react';

// <FileUpload
//     file={this.props.file}               //ямар файл хадгалагдсанг харуулах зорилгоор file : {'name': "file_name", 'size': "file_size"} бүтэцтэй байна.
//     className="mt-2"                     //Main Component -д нэг div дотор дуудах учир зөвхөн тухайн div ямар байрлалтай байх style ийг өгнө
//     default_text="Файл оруулна уу"       //Component анх дуудахад file input дээр гарч ирэх text
//     getFile={this.props.handleOnChange}  //upload хийгдэх үед тухайн файлыг хадгалж авах функц жич: getFile гэсэн нэрээр заавал дамжуулах
// />

function FileUpload(props) {

    const [current_size, SetSize] = useState('')
    const [kb_or_Mb, SetSymbol] = useState('')

    useEffect(() => {
        convertFileSize(props.file)
    }, [props.file])

    const convertFileSize = (file) => {
        if (file) {
            let file_size = file.size
            let divider = 1024
            file_size = file_size / divider
            SetSize(file_size.toFixed(3))
            SetSymbol('KB')
        }
    }

    const { file, className, default_text } = props
    return(
        <div>
            {
                <div className={`row ${className}`}>
                    <div className="custom-file col-md-6 my-auto ml-3">
                        <label className="custom-file-label" htmlFor="customFile"> {file? file.name : default_text}</label>
                        <input type="file"
                            id="customFile"
                            className="custom-file-input"
                            name='file'
                            style={{display: 'none'}}
                            onChange={(e) => props.getFile(e)}
                        />
                    </div>
                    <div className="col-md-5 d-flex flex-column ml-4">
                        <i> файлын нэр:&nbsp; &nbsp; {file ? file.name: ''} </i>
                        <i> файлын хэмжээ: &nbsp;{file && file['name'] ? <span>{current_size} &nbsp; {kb_or_Mb}</span> : ''} </i>
                    </div>
                </div>
            }
        </div>
    )
}

export default FileUpload;
