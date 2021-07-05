import React, { useState, useEffect } from 'react';
import './style.css'

// <FileUpload
//     file={this.props.file}               //ямар файл хадгалагдсанг харуулах зорилгоор file : {'name': "file_name", 'size': "file_size"} бүтэцтэй байна.
//     className="mt-2"                     //Main Component -д нэг div дотор дуудах учир зөвхөн тухайн div ямар байрлалтай байх style ийг өгнө
//     default_text="Файл оруулна уу"       //Component анх дуудахад file input дээр гарч ирэх text
//     getFile={this.props.handleOnChange}  //upload хийгдэх үед тухайн файлыг хадгалж авах функц жич: getFile гэсэн нэрээр заавал дамжуулах
//     accept="zip,application/octet-stream,application/zip,application/x-zip,application/x-zip-compressed"         // ямар файлын төрөл авахыг заана.
// />

function FileUpload(props) {

    const [files, SetFiles] = useState(props.files)

    useEffect(() => {
        convertFileSize(props.files)
    },  [props.files.length, props.files[0]?.name])

    const convertFileSize = (files_list) => {
        let converted_file_list = []
        let divider = 1024
        if (files_list) {
            files_list.map((file, idx) => {
                const file_detail = new Object()
                let file_size = file.size
                file_size = file_size / divider
                file_size = file_size.toFixed(3)
                file_detail['id'] = idx
                file_detail['name'] =  file.name
                file_detail['size'] = file_size
                file_detail['size_type'] = 'KB'

                converted_file_list.push(file_detail)
            })
            SetFiles(converted_file_list)
        }
    }


    const { className, default_text, accept, is_multiple } = props
    var last_file = files[files.length-1]
    if ( !is_multiple ){
        var file = files[0]
    }

    return(
        <div>
            {
                <div className={`row ${className}`}>
                    <div className="custom-file col-5 my-auto ml-3">
                        <div className='flex-container'>
                            <label  className='custom-label' htmlFor="clickFile"> {(files && files.length > 0 )? last_file.name : default_text}</label>
                            <div>
                                <label className='custom-label-2' htmlFor="clickFile"> <i className="fa fa-upload pr-1 pb-1 " aria-hidden="true"></i>  Browse</label>
                            </div>
                        <input
                            type="file"
                            name='files'
                            id="clickFile"
                            className='d-none'
                            onChange={(e) => props.fileAction(e, 'Get_File', is_multiple)}
                            multiple={is_multiple}
                            accept={accept}
                        />
                        </div>
                    </div>
                    <div className="col-5 ml-4 font-italic custom-media ">
                        {
                                is_multiple
                                ?
                                    <small>
                                        <ul className="my-auto">
                                            {
                                                files.map((file, idx) =>
                                                    <li key={idx}>{files ? file.name: ''} - {file.size}  {file.size_type}
                                                        <i className="fa fa-times ml-2 text-danger" onClick={() => props.fileAction(idx, 'Remove_File', is_multiple)}></i>
                                                    </li>
                                                )
                                            }
                                        </ul>
                                    </small>
                                :
                                    <div className="d-flex flex-column" style={{fontSize: '10px'}}>
                                        <i> файлын нэр:&nbsp; &nbsp; {file ? file.name: ''} </i>
                                        <i> файлын хэмжээ: &nbsp;{file && file['name'] ? <span>{file.size} &nbsp; {file.size_type}</span> : ''} </i>
                                    </div>
                        }
                    </div>
                </div>
            }
        </div>
    )
}

export default FileUpload;
