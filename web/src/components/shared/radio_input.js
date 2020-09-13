import { h } from 'preact';

function RadioInput({ checked, disabled, label, name, onChange, value }) {
  return (
    <div className="radio-input__group">
      <input
        checked={checked}
        disabled={disabled}
        class="radio-input__control"
        id={name}
        name={name}
        onChange={onChange}
        type="radio"
        value={value}
      />
      <label class="radio-input__field" for={name} />
      <label class="radio-input__label" for={name}>
        {label}
      </label>
    </div>
  );
}

export default RadioInput;
