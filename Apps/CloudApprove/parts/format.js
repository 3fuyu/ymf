/**
 * Created by Gin on 17/3/8.
 */
define([], function () {
    var json = {
        "application/msword": {
            "ext": "word.png"
        },
        "application/pdf": {
            "ext": "pdf.png"
        },
        "application/pgp-signature": {
            "ext": "other.png"
        },
        "application/postscript": {
            "ext": "other.png"
        },
        "application/rtf": {
            "ext": "other.png"
        },
        "application/vnd.ms-excel": {
            "ext": "exc.png"
        },
        "application/vnd.ms-powerpoint": {
            "ext": "ppt.png"
        },
        "application/zip": {
            "ext": "zipfile.png"
        },
        "application/x-shockwave-flash": {
            "ext": "other.png"
        },
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document": {
            "ext": "word.png"
        },
        "application/vnd.openxmlformats-officedocument.wordprocessingml.template": {
            "ext": "word.png"
        },
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": {
            "ext": "exc.png"
        },
        "application/vnd.openxmlformats-officedocument.presentationml.presentation": {
            "ext": "ppt.png"
        },
        "application/vnd.openxmlformats-officedocument.presentationml.template": {
            "ext": "other.png"
        },
        "application/vnd.openxmlformats-officedocument.presentationml.slideshow": {
            "ext": "other.png"
        },
        "application/x-javascript": {
            "ext": "other.png"
        },
        "application/json": {
            "ext": "other.png"
        },
        "audio/mpeg": {
            "ext": "other.png"
        },
        "audio/x-wav": {
            "ext": "music.png"
        },
        "audio/x-m4a": {
            "ext": "music.png"
        },
        "audio/ogg": {
            "ext": "music.png"
        },
        "audio/aiff": {
            "ext": "other.png"
        },
        "audio/flac": {
            "ext": "other.png"
        },
        "audio/aac": {
            "ext": "other.png"
        },
        "audio/ac3": {
            "ext": "other.png"
        },
        "audio/x-ms-wma": {
            "ext": "other.png"
        },
        "image/bmp": {
            "ext": "pic.png"
        },
        "image/gif": {
            "ext": "pic.png"
        },
        "image/jpeg": {
            "ext": "pic.png"
        },
        "image/photoshop": {
            "ext": "other.png"
        },
        "image/png": {
            "ext": "pic.png"
        },
        "image/svg+xml": {
            "ext": "other.png"
        },
        "image/tiff": {
            "ext": "other.png"
        },
        "text/plain": {
            "ext": "text.png"
        },
        "text/html": {
            "ext": "other.png"
        },
        "text/css": {
            "ext": "other.png"
        },
        "text/csv": {
            "ext": "other.png"
        },
        "text/rtf": {
            "ext": "other.png"
        },
        "video/mpeg": {
            "ext": "video.png"
        },
        "video/quicktime": {
            "ext": "video.png"
        },
        "video/mp4": {
            "ext": "video.png"
        },
        "video/x-m4v": {
            "ext": "video.png"
        },
        "video/x-flv": {
            "ext": "video.png"
        },
        "video/x-ms-wmv": {
            "ext": "video.png"
        },
        "video/avi": {
            "ext": "video.png"
        },
        "video/webm": {
            "ext": "video.png"
        },
        "video/3gpp": {
            "ext": "video.png"
        },
        "video/3gpp2": {
            "ext": "video.png"
        },
        "video/vnd.rn-realvideo": {
            "ext": "video.png"
        },
        "video/ogg": {
            "ext": "video.png"
        },
        "video/x-matroska": {
            "ext": "video.png"
        },
        "application/vnd.oasis.opendocument.formula-template": {
            "ext": "other.png"
        },
        "application/octet-stream": {
            "ext": "other.png"
        },
        "unknow": {
            "ext": "other.png"
        }
    };
    var Re = {
        getFormat: function (code) {
            if (code !== null && code !== undefined) {
                return json[code] || json.unknow;
            }
            return json.unknow;
        }
    };
    return Re;
});