const IP_REGEX = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/;

export default class EnvChecker {
  static isDev() {
    return !!(
      window.location.hostname &&
      (window.location.hostname.includes('localhost') ||
        window.location.hostname.includes('lvh.me') ||
        IP_REGEX.test(window.location.hostname))
    );
  }
}
