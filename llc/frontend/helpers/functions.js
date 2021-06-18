export const makeStateColor = (state) => {
    let color
    if (state == "ШИНЭ") color = 'text-success'
    else if (state == "ШИЙДВЭРЛЭГДСЭН") color = 'text-primary'
    else  color = 'text-warning'
    return color
}

export const makeKindColor = (kind) => {
    let color
    if (kind == "ХҮЛЭЭГДЭЖ БУЙ") color = 'text-warning'
    else if (kind == "БАТАЛГААЖСАН") color = 'text-success'
    else if (kind == "ЦУЦЛАСАН") color = 'text-danger'
    else if (kind == "БУЦААГДСАН") color = 'text-danger'
    else if (kind == "ШИНЭ") color = 'text-primary'
    return color
}
