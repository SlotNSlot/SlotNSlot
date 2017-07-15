import React from 'react';
import { connect } from 'react-redux';
import styles from './emotionButton.scss';
import Icon from '../../../icons';
import { toggleEmotion } from '../actions';

function mapStateToProps(appState) {
  return {
    playSlotState: appState.playSlot,
  };
}

class EmotionButton extends React.PureComponent {
  render() {
    const { playSlotState } = this.props;
    const isClicked = playSlotState.get('isClicked');
    const emotionList = playSlotState.get('emotionList');
    const emotionItems = emotionList.map(e =>
      <li>
        <div onClick={() => alert(e)}>
          {e}
        </div>
      </li>,
    );

    return (
      <div className={styles.emotionContainer}>
        <div
          onClick={() => {
            this.props.dispatch(toggleEmotion());
          }}
          className={`${styles.emotionButton} ${isClicked ? styles.active : ''}`}
        >
          <div className={styles.iconBlock}>
            <Icon icon="COMBINED_SHAPE" />
          </div>
          <span>
            {isClicked ? 'Cancel' : 'Emoji'}
          </span>
        </div>
        <ul className={`${styles.emotionList} ${isClicked ? styles.active : ''}`}>
          {isClicked ? emotionItems : ''}
        </ul>
      </div>
    );
  }
}

export default connect(mapStateToProps)(EmotionButton);
