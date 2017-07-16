import notie from 'notie';
import './notieHelper.scss';

class Toast {
  constructor() {
    notie.setOptions({
      alertTime: 3,
      classes: {
        container: 'notie-container',
        textbox: 'notie-textbox',
        textboxInner: 'notie-textbox-inner',
        button: 'notie-button',
        element: 'notie-element',
        elementHalf: 'notie-element-half',
        elementThird: 'notie-element-third',
        overlay: 'notie-overlay',
        backgroundSuccess: 'notie-background-success',
        backgroundWarning: 'notie-background-warning',
        backgroundError: 'notie-background-error',
        backgroundInfo: 'notie-background-info',
        backgroundNeutral: 'notie-background-neutral',
        backgroundOverlay: 'notie-background-overlay',
        alert: 'notie-alert',
      },
    });
  }

  get notie() {
    return notie;
  }
}

const toast = new Toast();
export default toast;
