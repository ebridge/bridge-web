import styled from 'styled-components';

const Checkbox = ({
  inputType,
  type,
  onChange,
  checked,
  label,
  isLoading,
}) => {
  const handleChange = evt => {
    if (isLoading) {
      return null;
    }
    return onChange(inputType, evt.target.checked);
  };

  return (
    <CheckboxLabel>
      <CheckboxInput
        type={type}
        onChange={handleChange} checked={checked}
      />
      <span>{label}</span>
    </CheckboxLabel>
  );
};

const CheckboxLabel = styled.label`
  display: inline-flex;
  align-items: center;
  cursor: pointer;
  position: relative;
`;

const CheckboxInput = styled.input`
  cursor: pointer;
  height: 25px;
  width: 25px;

  /* Appearance */
  outline: none;
  -webkit-appearance: none;
     -moz-appearance: none;
       -o-appearance: none;
          appearance: none;

  /* Border */
  border: 1px solid #000;
  border-radius: 4px;
  
  background-color: #E8EEEF;
  transition-duration: 0.3s;

  &:checked {
    border: 1px solid ${props => props.theme.colors.buttonGreen};
    background-color: ${props => props.theme.colors.buttonGreen};
  }

  &:checked:hover {
    background-color: ${props => props.theme.colors.buttonGreenHover};
  }

  &:checked + span::before {
    content: '\u2713'; /* checkmark */
    display: block;
    text-align: center;
    color: #fff;
    position: absolute;
    left: 0.7rem;
    top: 0.3rem;
  }
`;

export default Checkbox;
