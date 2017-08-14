import React from 'react';
import { connect } from 'react-redux';
import styles from './termsSection.scss';
import { toggleAgreeTerms, toggleLegalResident } from '../actions';
import Icon from '../../../../icons';

const termsHTML = require('./terms.html');

function createMarkup() {
  return { __html: termsHTML };
}

function mapStateToProps(appState) {
  return {
    contributePage: appState.contributePage,
  };
}

class TermsSection extends React.PureComponent {
  constructor(props) {
    super(props);

    this.toggleResidentCheckbox = this.toggleResidentCheckbox.bind(this);
    this.toggleTermsCheckbox = this.toggleTermsCheckbox.bind(this);
  }

  render() {
    const { contributePage } = this.props;
    const allAgree = contributePage.get('checkTerms') && contributePage.get('checkResident');
    return (
      <div className={styles.modalContainer}>
        <button className={styles.closeBtn} onClick={this.props.handleClose}>
          <Icon icon="CANCEL" />
        </button>
        <div className={styles.termsBox}>
          <div dangerouslySetInnerHTML={createMarkup()} />
        </div>
        <div className={styles.checkboxWrapper}>
          <input
            type="checkbox"
            id="readAgree"
            onChange={this.toggleTermsCheckbox}
            checked={contributePage.get('checkTerms')}
          />
          <label htmlFor="readAgree">
            I have carefully read and agree to *the terms and conditions* of SlotNSlot Token(SLOT) Creation.
          </label>
        </div>
        <div className={styles.checkboxWrapper}>
          <input
            type="checkbox"
            id="residentAgree"
            onChange={this.toggleResidentCheckbox}
            checked={contributePage.get('checkResident')}
          />
          <label htmlFor="residentAgree">
            I am not a citizen or resident of a country where the legislation conflicts with the present allocation of
            SLOT and/or the SlotNSlot Project in general.Creation.
          </label>
        </div>
        <button onClick={this.props.handleNext} className={styles.nextBtn} disabled={!allAgree}>
          NEXT
        </button>
      </div>
    );
  }

  toggleTermsCheckbox() {
    const { dispatch } = this.props;
    dispatch(toggleAgreeTerms());
  }

  toggleResidentCheckbox() {
    const { dispatch } = this.props;
    dispatch(toggleLegalResident());
  }
}

export default connect(mapStateToProps)(TermsSection);
