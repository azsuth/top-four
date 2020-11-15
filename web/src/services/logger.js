import { useEffect } from 'preact/hooks';
import ReactGA from 'react-ga';

import { logErrorMessageService } from '@services';

let initialized = false;

const maybeInitialize = () => {
  if (process.env.NODE_ENV === 'test') return;

  if (!initialized) {
    ReactGA.initialize(process.env.TOP_FOUR_ANALYTICS_TRACKING_ID, {
      titleCase: false
    });
    initialized = true;
  }
};

const pageView = page => {
  maybeInitialize();

  if (process.env.NODE_ENV !== 'test') {
    ReactGA.pageview(page);
  }
};

const path = () => {
  const {
    location: { pathname }
  } = window;

  return pathname.substring(pathname.lastIndexOf('/'));
};

const logError = error => {
  const message = `${error.message} | ${error.stack}`;

  logErrorMessage(message);
};

const logErrorMessage = message => {
  const toLog = `${path()} | ${message}`;

  if (process.env.NODE_ENV !== 'test') {
    logErrorMessageService(toLog, process.env.NODE_ENV);
  }
};

const withPageView = WrappedComponent => {
  return props => {
    useEffect(() => {
      pageView(path());
    }, []);

    return <WrappedComponent {...props} />;
  };
};

export { logError, logErrorMessage, withPageView };
