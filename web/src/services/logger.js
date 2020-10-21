import { useEffect } from 'preact/hooks';
import ReactGA from 'react-ga';

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
  maybeInitialize();

  const message = `${error.message} | ${error.stack}`;
  const toLog = `${path()} | ${message}`;

  if (process.env.NODE_ENV !== 'test') {
    ReactGA.exception({
      description: toLog,
      fatal: true
    });
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

export { logError, withPageView };
