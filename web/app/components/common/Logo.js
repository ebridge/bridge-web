import LogoSvg from '../../assets/images/logo.svg';
import LogoOutlinedSvg from '../../assets/images/logoOutlined.svg';

const Logo = ({ withBg, size }) => {
  if (withBg) {
    return (
      <>
        <LogoOutlinedSvg viewBox='-50 -50 500 500' width={size} height={size}/>
      </>
    );
  }
  return (
    <LogoSvg viewBox='-50 -50 500 500' width='100' height='100'/>
  );
};


export default Logo;
