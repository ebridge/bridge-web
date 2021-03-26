import axios from 'axios';
import logger from './logger';

const uploadProfilePicture = async (url, img) => {
  try {
    const buffer = Buffer.from(img.replace(/^data:image\/\w+;base64,/, ''), 'base64');
    delete axios.defaults.headers.common.authorization;
    await axios.put(url, buffer, {
      headers: {
        'Content-Type': 'image/png',
        'Content-Encoding': 'base64',
        'x-amz-acl': 'public-read',
      },
    });
    // TODO display status on success/failure to user
    return url.split('?')[0];
  } catch (err) {
    logger.error('Error uploading...');
    return logger.error(err);
  }
};

export default uploadProfilePicture;
