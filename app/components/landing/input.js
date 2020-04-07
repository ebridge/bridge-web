import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import validator from 'validator';

class LandingInput extends React.Component {
  constructor() {
    super();
    this.state = {
      value: '',
    };
  }

  handleValidation = () => {}

  render() {
    return (
      <StyledInput
        value={this.state.value}
        onChange={this.handleValidation}
        type={this.props.type}
        placeholder={this.props.placeholder}
      />
    );
  }
}

const StyledInput = styled.input`
  color: #384047;
  background-color: #e8eeef;
  box-shadow: 0px 1px 1px rgba(0,0,0,0.03) inset;

  border: none;
  /* border: 1px solid black; */
  /* outline: 1px solid red; */
  border-radius: 4px;

  padding: 1em;
  margin-bottom: 1em;

  width: 100%;
`;

LandingInput.propTypes = {
  type: PropTypes.string,
  placeholder: PropTypes.string,
};
export default LandingInput;
