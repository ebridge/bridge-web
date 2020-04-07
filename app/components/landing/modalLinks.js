import styled from 'styled-components';
import PropTypes from 'prop-types';

const LandingModalLinks = (props) => (
  <LinkWrapper>
    {props.children}
  </LinkWrapper>
);

const LinkWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  align-items: center;
`;

LandingModalLinks.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
};

export default LandingModalLinks;
