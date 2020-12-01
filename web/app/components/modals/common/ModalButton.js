import styled from 'styled-components';
import { breakpoints } from '../../../lib/styleUtils';
import Loader from '../../common/Loader';

const Button = ({
  type,
  width,
  boxShadow,
  isLoading,
  disabled,
  onClick,
  children,
}) => (
  <ModalButton
    type={type || 'button'}
    width={width}
    boxShadow={boxShadow || null}
    isLoading={isLoading}
    disabled={disabled} onClick={onClick}
  >
    {isLoading ? <Loader /> : children}
  </ModalButton>
);

const handleButtonState = props => {
  if (props.isLoading || props.disabled) {
    return `
      cursor: not-allowed;
      background-color: ${props.theme.colors.buttonGreenDisabled};
    `;
  }
  return `
    cursor: pointer;
    background-color: ${props.theme.colors.buttonGreen};
    transition: background-color 0.3s;

    &:hover {
      background-color: ${props.theme.colors.buttonGreenHover}
    }
  `;
};

const ModalButton = styled.button`
  ${props => handleButtonState(props)}

  display: flex;
  justify-content: center;
  align-items: center;

  width: ${({ width }) => (width || '100%')};
  padding: 0.8em;
  margin: 1em 0;

  text-align: center;
  font-size: 19px;
  font-weight: 600;

  color: #fff;

  border: none;
  border-radius: 4px;
  box-shadow: ${props => (props.boxShadow ? '0px 2px 6px rgba(0,0,0,0.3)' : '')};

  ${breakpoints.mobile} {
    width: 100%;
  }
`;

export default Button;
