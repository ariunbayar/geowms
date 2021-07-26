import React, { useState, useEffect } from 'react';
import './style.css'

// <FileUpload
//     files={this.props.file}               //ямар файл хадгалагдсанг харуулах зорилгоор file : {'name': "file_name", 'size': "file_size"} бүтэцтэй байна.
//     className="mt-2"                     //Main Component -д нэг div дотор дуудах учир зөвхөн тухайн div ямар байрлалтай байх style ийг өгнө
//     default_text="Файл оруулна уу"       //Component анх дуудахад file input дээр гарч ирэх text
//     getFile={this.props.handleOnChange}  //upload хийгдэх үед тухайн файлыг хадгалж авах функц жич: getFile гэсэн нэрээр заавал дамжуулах
//     accept="zip,application/octet-stream,application/zip,application/x-zip,application/x-zip-compressed"         // ямар файлын төрөл авахыг заана.
//     is_multiple                          //Олон файл оруулах үед ашиглана value True  байна.
//     is_validate={true}                   //зөвхөн validation style ийш харуулна.
//     info_text='Zip файл оруулах ёстой'  //

// />

// getFile(files){
//     this.setState({ files })
// }


// props.files заавал list байна.

function FileUpload(props) {

    const [files, SetFiles] = useState(props.files || [])

    useEffect(() => {
        convertFileSize(props.files)
    },  [props.files.length, props.files[0]?.name])

    const convertFileSize = (files_list) => {
        let converted_file_list = []
        let divider = 1024
        if (files_list && files_list.length > 0) {
            files_list.map((file, idx) => {
                if(file){
                    const file_detail = new Object()
                    let file_size = file.size
                    file_size = file_size / divider
                    file_size = file_size.toFixed(3)
                    file_detail['id'] = idx
                    file_detail['name'] =  file.name
                    file_detail['size'] = file_size
                    file_detail['size_type'] = 'KB'
                    converted_file_list.push(file_detail)
                }
            })
            SetFiles(converted_file_list)
        }
        else SetFiles([])
    }

    const fileAction = (value, action, is_multiple) => {
        var file_list = files
        if (action == 'Get_File') {
            const uploaded_file = value.target.files[0]

            if (is_multiple ) {
                file_list.push(uploaded_file)
            }
            else {
                file_list[0] = uploaded_file
            }
        }
        else {
            file_list.splice(value, 1)
        }

        props.getFile(file_list)
        SetFiles(file_list)
    }

    const { className, default_text, accept, is_multiple, info_text, is_validate, disabled } = props
    var last_file = files[files.length-1]
    if (last_file){
        var default_files = last_file.name
    }
    if ( !is_multiple ){
        var file = files[0]
    }
    return(
        <div>
            {
                <div className={`row ${className}`}>
                    <div className="custom-file col-5 my-auto ml-3">
                        <div className={`flex-container ${is_validate && 'border-danger'}`}>
                            <label className='custom-label'  htmlFor="clickFile"> {(files && files.length > 0 )? default_files : default_text}</label>
                            {
                                !is_validate
                                ?
                                    <i className="fa fa-trash-o m-1 mr-2 float-right" role="button" onClick={(e) => fileAction(e, 'Remove_File', is_multiple)}></i>
                                :
                                    <i className="fa fa-exclamation-circle m-1 mr-2 blink text-danger"></i>
                            }
                            <div>
                                <label className='custom-label-2' htmlFor="clickFile"> <i className="fa fa-upload pr-1 pb-1 " aria-hidden="true"></i>  Browse</label>
                            </div>
                            <input
                                type="file"
                                name='files'
                                id="clickFile"
                                className='d-none'
                                onChange={(e) => fileAction(e, 'Get_File', is_multiple)}
                                multiple={is_multiple}
                                accept={accept}
                                disabled={disabled}
                            />
                        </div>
                        {
                            info_text
                            ?
                                <i className="fa fa-exclamation-circle custom-descripion float-top">&nbsp;&nbsp;{info_text}</i>
                            :
                                null
                        }
                    </div>
                    <div className={`col-5 ml-4 font-italic custom-media ${info_text ? "mt-3" : ""}`}>
                        {
                            is_multiple
                            ?
                                <ul className="my-auto">
                                    {
                                        files.map((file, idx) =>
                                            <li key={idx}>{file ? file.name: ''} - {file ? (file.size, file.size_type): ''}
                                                <small>
                                                    <i role="button" className="fa fa-times ml-2 text-danger" onClick={() => fileAction(idx, 'Remove_File', is_multiple)}></i>
                                                </small>
                                            </li>
                                        )
                                    }
                                </ul>
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
