import {
  useCallback, useEffect, useRef, useState,
} from 'react';
import { connect } from 'react-redux';
import ReactCrop from 'react-image-crop';
import styled from 'styled-components';
import 'react-image-crop/dist/ReactCrop.css';
import Button from './common/ModalButton';

const CropModal = modalProps => {
  const [crop, setCrop] = useState({ unit: '%', width: 100, aspect: 1 / 1 });
  const previewCanvasRef = useRef(null);
  const imgRef = useRef(null);
  const [completedCrop, setCompletedCrop] = useState(null);

  const onLoad = useCallback((img) => {
    imgRef.current = img;
  }, []);


  useEffect(() => {
    if (!completedCrop || !previewCanvasRef.current || !imgRef.current) {
      return;
    }
    const pixelRatio = window.devicePixelRatio || 1;

    const image = imgRef.current;
    const canvas = previewCanvasRef.current;
    const thisCrop = completedCrop;

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    const ctx = canvas.getContext('2d');

    canvas.width = crop.width * pixelRatio;
    canvas.height = thisCrop.height * pixelRatio;

    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    ctx.imageSmoothingQuality = 'high';

    ctx.drawImage(
      image,
      thisCrop.x * scaleX,
      thisCrop.y * scaleY,
      thisCrop.width * scaleX,
      thisCrop.height * scaleY,
      0,
      0,
      thisCrop.width,
      thisCrop.height
    );
  }, [completedCrop]);

  const getResizedCanvas = (canvas, newWidth, newHeight) => {
    const tmpCanvas = document.createElement('canvas');
    tmpCanvas.width = newWidth;
    tmpCanvas.height = newHeight;

    const ctx = tmpCanvas.getContext('2d');
    ctx.drawImage(
      previewCanvasRef.current,
      0,
      0,
      previewCanvasRef.current.width,
      previewCanvasRef.current.height,
      0,
      0,
      newWidth,
      newHeight
    );

    return tmpCanvas;
  };

  const generateDownload = previewCanvas => {
    if (!completedCrop || !previewCanvas) {
      return;
    }

    const canvas = getResizedCanvas(previewCanvas, completedCrop.width, completedCrop.height);
    const base64Png = canvas.toDataURL();
    // TODO: send img to db - temp log
    // eslint-disable-next-line no-console
    console.log(base64Png);
  };
  return (
    <>
      <CropModalWrapper>
        <ReactCrop
          src={modalProps.image}
          style={{ width: '90%' }}
          onImageLoaded={onLoad}
          crop={crop}
          onChange={(c) => setCrop(c)}
          onComplete={(c) => setCompletedCrop(c)}
          minHeight={200}
          minWidth={200}
          ruleOfThirds
          circularCrop
          keepSelection
        />
        <canvas
          ref={previewCanvasRef}
          style={{
            display: 'none',
            width: Math.round(completedCrop?.width ?? 0),
            height: Math.round(completedCrop?.height ?? 0),
          }}
        />
      </CropModalWrapper>
      <Button onClick={() => generateDownload([previewCanvasRef.current, completedCrop])}>
          Set Profile Picture
      </Button>
    </>
  );
};

const CropModalWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  max-width: 400px;
  flex: 1;
`;

const mapStateToProps = (state = {}) => ({
  modalProps: state?.modal?.modalProps,
});


export default connect(mapStateToProps)(CropModal);
