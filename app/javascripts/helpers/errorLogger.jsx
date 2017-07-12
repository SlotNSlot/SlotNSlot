import Raven from 'raven-js';
import EnvChecker from './envChecker';

export default function logException(ex, context) {
  if (!EnvChecker.isDev()) {
    Raven.captureException(ex, {
      extra: context,
    });
    /* eslint no-console:0 */
    window.console && console.error && console.error(ex);
  }
}
