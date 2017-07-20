import React from 'react';
import { Switch, Route } from 'react-router-dom';
// components
import Icon from '../../icons';
import MakeGameFirstStep from './firstStep';
import MakeGameSecondStep from './secondStep';
import MakeGameThirdStep from './thirdStep';
import MakeGameFourthStep from './fourthStep';
import MakeGameCompleteStep from './completeStep';
import MakeGameProgress from './progress';
import Status404 from '../404';
// styles
import styles from './makeGame.scss';

const MakeGame = ({ match }) => {
  return (
    <div className={styles.makeGameContainer}>
      <div className={styles.makeGameContent}>
        <Icon className={styles.makeSlotIcon} icon="MAKE_SLOT" />
        <MakeGameProgress currentStep={match.params.step} />
        <Switch>
          <Route
            path={match.url}
            render={() => {
              if (parseInt(match.params.step, 10) === 1) {
                return <MakeGameFirstStep />;
              } else if (parseInt(match.params.step, 10) === 2) {
                return <MakeGameSecondStep />;
              } else if (parseInt(match.params.step, 10) === 3) {
                return <MakeGameThirdStep />;
              } else if (parseInt(match.params.step, 10) === 4) {
                return <MakeGameFourthStep />;
              } else if (match.params.step === 'complete') {
                return <MakeGameCompleteStep />;
              }
              return <MakeGameFirstStep />;
            }}
          />
          <Route component={Status404} />
        </Switch>
      </div>
    </div>
  );
};

export default MakeGame;
