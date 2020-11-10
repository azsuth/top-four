import { h } from 'preact';

function Superlative({ superlative }) {
  const { header, subheader, recipient, footer } = superlative;

  return (
    <div class="container min-height--50-pct flex direction--column justify--between align-items--center margin--large padding-v--large padding-h--s">
      <div class="text-align--center">
        <h1 class="modal-header color--primary-darkest margin-b--xs">
          {header}
        </h1>
        <h2 class="font-weight--bold">{subheader}</h2>
      </div>
      <span class="font-size--xlarge font-weight--bold">{recipient}</span>
      <span class="font-size--base">{footer}</span>
    </div>
  );
}

export default Superlative;
