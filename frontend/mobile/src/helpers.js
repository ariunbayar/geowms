export const helpers = {
    parseCoordinateString,
}


function parseCoordinateString(coordinate_string) {

    const result = /^(?<latitude>-?\d+(\.\d+)?)[, ](?<longitude>-?\d+(\.\d+)?)$/.exec(coordinate_string)
    let [lat, lon] = [0, 0]

    if (result) {
        lat = parseFloat(result.groups.latitude)
        lon = parseFloat(result.groups.longitude)
    }

    // According to OpenLayers the format is [x, y] or [longitude, latitude]
    return [lon, lat]
}
