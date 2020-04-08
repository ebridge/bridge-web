import styled from 'styled-components';
import PropTypes from 'prop-types';
import { breakpoints } from '../../lib/styleUtils';

const LandingModal = (props) => (
  <ModalContainer>
    <ModelContent>
      <ModalTitle>{props.title}</ModalTitle>
      {props.children}
    </ModelContent>
  </ModalContainer>
);

const ModalContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-content: center;
`;

const ModelContent = styled.div`
  min-width: 400px;
  max-width: 600px;
  padding: 2em;
  padding-bottom: 3em;
  background-color: rgba(255, 255, 255, 0.7);
  border-radius: 8px;
  
  ${breakpoints.mobile} {
    min-width: 0;
  }
`;

const ModalTitle = styled.h1`
  text-align: center;
  line-height: 1.5em;
  margin-bottom: 1.2em;
  margin-top: 0.2em;
`;

LandingModal.propTypes = {
  title: PropTypes.string,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
};
export default LandingModal;
