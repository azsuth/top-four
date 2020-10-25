import { h } from 'preact';

import cx from 'utilities/cx';

function TextInput({
  disabled,
  getRef,
  label,
  name,
  onBlur,
  onChange,
  onFocus,
  placeholder,
  value
}) {
  const controlClasses = cx('text-input__control', {
    'with-placeholder': placeholder && !label,
    'without-placeholder': !placeholder
  });

  return (
    <div class="text-input__group">
      <input
        class={controlClasses}
        disabled={disabled}
        id={name}
        name={name}
        onBlur={onBlur}
        onChange={({ target: { value } }) => onChange(value)}
        onFocus={onFocus}
        placeholder={placeholder || 'placeholder'}
        ref={getRef}
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
