import Raven from 'raven-js';
import EnvChecker from './envChecker';

export function logException(ex, context, level) {
  if (!EnvChecker.isDev()) {
    Raven.captureException(ex, {
      extra: context,
      level: level || 'error',
    });
    /* eslint no-console:0 */
    window.console && console.error && console.error(ex);
  }
}
