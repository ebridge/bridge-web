import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const LandingInput = ({
  name,
  type,
  placeholder,
  value,
  validity,
  onTextChange,
  errors,
}) => (
  <>
    <StyledInput
      value={value}
      isValid={validity === true || typeof validity === 'undefined'}
      onChange={(event) => onTextChange(name, event.target.value)}
      type={type}
      placeholder={placeholder}
    />
    {errors && (
      <ErrorContainer>
        {errors.map((error) => (
          <p key={error}>{error}</p>
        ))}
      </ErrorContainer>
    )}
  </>
);

const StyledInput = styled.input`
  color: #384047;
  background-color: #e8eeef;
  box-shadow: 0px 1px 1px rgba(0,0,0,0.03) inset;
  border-radius: 4px;

  padding: 1em;
  margin-bottom: 1em;

  width: 100%;

  ${(props) => (props.isValid ? `
    border: 1px solid black;

  ` : `
    border: 1px solid red;
  `)}
`;

// TODO: Style
const ErrorContainer = styled.div`
  width: 100%;
  color: red;
`;

LandingInput.propTypes = {
  name: PropTypes.string,
  type: PropTypes.string,
  placeholder: PropTypes.string,
  value: PropTypes.string,
  validity: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.arrayOf(PropTypes.string),
  ]),
  onTextChange: PropTypes.func,
  errors: PropTypes.arrayOf(PropTypes.string),
};
export default LandingInput;
