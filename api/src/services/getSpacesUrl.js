const AWS = require('aws-sdk');
const { ValidationError } = require('../lib/errors');
const { IMAGE_MIME_TYPES } = require('../lib/constants/imageTypes');

const spacesEndpoint = new AWS.Endpoint(`${process.env.SPACES_REGION}.digitaloceanspaces.com`);
const s3 = new AWS.S3({
  endpoint: spacesEndpoint,
  accessKeyId: process.env.SPACES_KEY,
  secretAccessKey: process.env.SPACES_SECRET,
});

const getSpacesUrl = (filename, displayName) => {
  const splitFilename = filename?.split('.');
  const fileExt = splitFilename?.[1];
  if (!splitFilename.length || !Object.keys(IMAGE_MIME_TYPES).includes(fileExt)) {
    throw new ValidationError(
      `Invalid image type: ${fileExt}`,
      `Invalid image type: ${fileExt}`
    );
  }

  const expireSeconds = 60 * 5; // 5 minutes
  const params = {
    Bucket: process.env.SPACES_BUCKET,
    // will always be .png because of frontend conversion
    Key: `${process.env.SPACES_ENV_FOLDER}/images/profile/${displayName}.png`,
    Expires: expireSeconds,
    ContentType: IMAGE_MIME_TYPES.png,
    ACL: 'public-read',
  };

  console.log('params for url: ', params);
  const signedUrl = s3.getSignedUrl('putObject', params);
  console.log('signed url returned from s3: ', signedUrl);
  return signedUrl;
};

// May be needed in the future if we want to avoid overwriting previous profile pictures
// const getIterationFromUrl = url => {
//   const splitUrl = url.split('.');
//   const splitFilename = splitUrl[splitUrl.length - 2].split('/');
//   const filename = splitFilename[splitFilename.length - 1];
//   const splitUnderscores = filename.split('_');
//   if (splitUnderscores.length === 1) {
//     return 0;
//   }
//   const currentIteration = splitUnderscores[splitUnderscores.length - 1];
//   let pictureIteration = 1;
//   if (Number(currentIteration)) {
//     pictureIteration = Number(currentIteration) + 1;
//   }
//   return pictureIteration;
// };

module.exports = {
  getSpacesUrl,
};
