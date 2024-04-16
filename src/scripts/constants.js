const CONSTANTS = {
    MODULE_ID: "choices-plus",
    PATH: `modules/choices-plus/`,
    imageReg: /(.*)\.(gif|png|jpg|jpeg|webp|svg|psd|bmp|tif|GIF|PNG|JPG|JPEG|WEBP|SVG|PSD|BMP|TIF)/gi,
    imageUrlReg: /http((.*)\.(gif|png|jpg|jpeg|webp|svg|psd|bmp|tif|GIF|PNG|JPG|JPEG|WEBP|SVG|PSD|BMP|TIF))/gi,
    imageRegBase64: /(data:image\/[^;]+;base64[^"]+)/gi,
    FLAGS: {
        MACRO: "macro",
        ENABLE: "enable",
    },
};

export default CONSTANTS;
