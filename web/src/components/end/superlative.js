import { h } from 'preact';

function Superlative({ superlative }) {
  const { header, subheader, recipient, footer } = superlative;

  return (
    <div class="flex-grow--1 width--100-pct flex direction--column justify--between align-items--center">
      <div class="text-align--center">
        <h1 class="modal-header color--primary-darkest margin-b--xs">
          {header}
        </h1>
        <h2 class="font-weight--bold">{subheader}</h2>
      </div>
      <span class="font-size--xlarge font-weight--bold text-align--center">
        {recipient}
      </span>
      <span class="font-size--base text-align--center">{footer}</span>
    </div>
  );
}

export default Superlative;
