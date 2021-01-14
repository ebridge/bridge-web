import axios from 'axios';
import logger from './logger';

const uploadProfilePicture = async (url, img) => {
  try {
    const buffer = Buffer.from(img.replace(/^data:image\/\w+;base64,/, ''), 'base64');
    logger.log('attempting to upload img to url: ', url);
    const res = await axios.put(url, buffer, {
      headers: {
        'Content-Type': 'image/png',
        'Content-Encoding': 'base64',
        'x-amz-acl': 'public-read',
        'Access-Control-Allow-Origin': '*',
      },
    });
    logger.log('upload success!');
    logger.log(res);
  } catch (err) {
    logger.error('error uploading');
    logger.error(err);
  }
};

export default uploadProfilePicture;
