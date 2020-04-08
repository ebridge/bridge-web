import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import validator from 'validator';

class LandingInput extends React.Component {
  constructor() {
    super();
    this.state = {
      value: '',
      valid: null,
    };

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e) {
    const input = e.target.value;
    let validInput = false;
    switch (this.props.name) {
    case 'email':
      if (validator.isEmail(input)) {
        validInput = true;
        break;
      }
      break;
    case 'display':
      if (validator.isLength(input, { min: 3, max: 20 })) {
        validInput = true;
        break;
      }
      break;
    case 'password':
      if (validator.isLength(input, { min: 5, max: 10 })) {
        validInput = true;
        break;
      }
      break;
    case 'password repeat':
      break;
    default:
      validInput = false;
      break;
    }

    if (validInput) {
      this.setState({
        value: input,
        valid: true,
      });
    } else {
      this.setState({
        value: input,
        valid: false,
      });
    }
  }

  render() {
    return (
      <StyledInput
        value={this.state.value}
        valid={this.state.valid}
        onChange={this.handleChange}
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
  border-radius: 4px;

  padding: 1em;
  margin-bottom: 1em;

  width: 100%;

  ${(props) => (props.valid ? `
    border: 1px solid black;

  ` : `
    border: 1px solid red;
  `)}
`;

LandingInput.propTypes = {
  name: PropTypes.string,
  type: PropTypes.string,
  placeholder: PropTypes.string,
};
export default LandingInput;
