const imageMIMEType = subType => `image/${subType}`;

const IMAGE_MIME_TYPES = {
  apng: imageMIMEType('apng'),
  bmp: imageMIMEType('bmp'),
  gif: imageMIMEType('gif'),
  ico: imageMIMEType('x-icon'),
  cur: imageMIMEType('x-icon'),
  jpg: imageMIMEType('jpeg'),
  jpeg: imageMIMEType('jpeg'),
  jfif: imageMIMEType('jpeg'),
  pjpeg: imageMIMEType('jpeg'),
  pjp: imageMIMEType('jpeg'),
  png: imageMIMEType('png'),
  svg: imageMIMEType('svg+xml'),
  tif: imageMIMEType('tiff'),
  tiff: imageMIMEType('tiff'),
  webp: imageMIMEType('webp'),
};

module.exports = { IMAGE_MIME_TYPES };
