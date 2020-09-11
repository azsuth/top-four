import { h } from 'preact';

import cx from 'utilities/cx';

function TextInput({ label, name, onChange, placeholder, value }) {
  const controlClasses = cx('text-input__control', {
    'with-placeholder': placeholder && !label
  });

  return (
    <div class="text-input__group">
      <input
        class={controlClasses}
        id={name}
        name={name}
        onChange={({ target: { value } }) => onChange(value)}
        placeholder={placeholder}
        type="text"
        value={value}
      />
      <label class="text-input__label" for={name}>
        {label}
      </label>
    </div>
  );
}

export default TextInput;
