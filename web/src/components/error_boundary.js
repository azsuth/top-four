import { h, Component } from 'preact';

import { logError } from '@services/logger';

import Button from 'components/shared/button';
import Logo from 'components/shared/logo';

class ErrorBoundary extends Component {
  constructor() {
    super();
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error) {
    if (process.env.NODE_ENV !== 'production') console.log(error);

    logError(error);
  }

  handleClick = () => {
    window.location.href = '/';
  };

  render({ children }, { hasError }) {
    if (!hasError) return children;

    return (
      <div class="error bg-color--primary height--100-pct flex direction--column align-items--center padding--s">
        <div class="margin-t--xlarge">
          <Logo size="small" />
        </div>
        <h1 class="modal-header color--white margin-v--large">oops...</h1>
        <div class="flex-grow--1 flex direction--column justify--around align-items--center text-align--center color--white font-weight--bold font-size--base">
          <span>...we're embarassed, but something went wrong.</span>
          <span>Maybe try refreshing the page?</span>
          <span>
            Or{' '}
            <span class="error__home-button">
              <Button
                name="return-home"
                onClick={this.handleClick}
                variant="secondary"
              >
                return home
              </Button>
            </span>{' '}
            and rejoin the fun!
          </span>
        </div>
      </div>
    );
  }
}

export { ErrorBoundary };
export default ErrorBoundary;
