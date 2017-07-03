import React from 'react';
import { connect } from 'react-redux';
// actions
import { handleSubmit, handleInputChange } from './actions';
// styles
import styles from './makeGame.scss';

export const INPUT_TYPES = {
  SLOT_NAME: 'slotName',
  PLAYER_CHANCE: 'playerChance',
  MINIMUM_VALUE: 'minimumValue',
  MAXIMUM_VALUE: 'maximumValue',
  DEPOSIT: 'deposit',
};

function mapStateToProps(appState) {
  return {
    makeGame: appState.makeGame,
  };
}

class MakeGame extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    const { makeGame } = this.props;
    const errorBorder = inputType => ({
      border: makeGame.get(`${inputType}Error`) !== '' ? '1px solid #e02121' : '0',
    });
    return (
      <div className={styles.makeGameContainer}>
        <form
          onSubmit={e => {
            this.handleSubmit(e);
          }}
          className={styles.makeGameForm}
        >
          <h1>Please Make your own slot machine!</h1>
          <div className={styles.inputRow}>
            <div className={styles.inputLabel}>Name of your machine</div>
            <input
              style={errorBorder('slotName')}
              onChange={e => {
                this.handleInputChange(e, INPUT_TYPES.SLOT_NAME);
              }}
              className={styles.makeGameFormInput}
              value={makeGame.get('slotName')}
              type="text"
              placeholder="My Awesome Machine"
            />
          </div>
          <div className={styles.inputRow}>
            <div className={styles.inputLabel}>Chance to Win(player) (% variable)</div>
            <input
              style={errorBorder('playerChance')}
              onChange={e => {
                this.handleInputChange(e, INPUT_TYPES.PLAYER_CHANCE);
              }}
              className={styles.makeGameFormInput}
              value={makeGame.get('playerChance')}
              type="number"
              placeholder={30}
            />
          </div>
          <div className={styles.inputRow}>
            <div className={styles.inputLabel}>Deposit $</div>
            <input
              style={errorBorder('deposit')}
              onChange={e => {
                this.handleInputChange(e, INPUT_TYPES.DEPOSIT);
              }}
              className={styles.makeGameFormInput}
              value={makeGame.get('deposit')}
              type="number"
              placeholder={100}
            />
          </div>
          <div className={styles.inputRow}>
            <div className={styles.inputLabel}>Maximum value $</div>
            <input
              style={errorBorder('maximumValue')}
              onChange={e => {
                this.handleInputChange(e, INPUT_TYPES.MAXIMUM_VALUE);
              }}
              className={styles.makeGameFormInput}
              value={makeGame.get('maximumValue')}
              type="number"
              placeholder={100}
            />
          </div>
          <div className={styles.inputRow}>
            <div className={styles.inputLabel}>Minimum value $</div>
            <input
              style={errorBorder('minimumValue')}
              onChange={e => {
                this.handleInputChange(e, INPUT_TYPES.MINIMUM_VALUE);
              }}
              className={styles.makeGameFormInput}
              value={makeGame.get('minimumValue')}
              type="number"
              placeholder={3}
            />
          </div>

          <div className={styles.warningMessage}>
            <p>
              {makeGame.get('slotNameError')}
            </p>
            <p>
              {makeGame.get('playerChanceError')}
            </p>
            <p>
              {makeGame.get('minimumValueError')}
            </p>
            <p>
              {makeGame.get('maximumValueError')}
            </p>
            <p>
              {makeGame.get('depositError')}
            </p>
          </div>
          <div>
            {makeGame.get('isLoading') ? 'LOADING...' : null}
          </div>

          <div className={styles.inputRow}>
            <button type="submit" className={styles.submitBtn}>
              Submit
            </button>
          </div>
        </form>
      </div>
    );
  }

  handleInputChange(e, type) {
    const { dispatch } = this.props;
    const targetValue = e.currentTarget.value;

    dispatch(handleInputChange(type, targetValue));
  }

  handleSubmit(e) {
    const { dispatch, makeGame } = this.props;
    e.preventDefault();

    const params = {
      slotName: makeGame.get('slotName'),
      minimumValue: makeGame.get('minimumValue'),
      playerChance: makeGame.get('playerChance'),
      maximumValue: makeGame.get('maximumValue'),
      deposit: makeGame.get('deposit'),
    };

    dispatch(handleSubmit(params));
  }
}

export default connect(mapStateToProps)(MakeGame);
