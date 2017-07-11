import React from 'react';
import { Switch, Route } from 'react-router-dom';
// components
import Icon from '../../icons';
import MakeGameFirstStep from './firstStep';
import MakeGameSecondStep from './secondStep';
import MakeGameProgress from './progress';
import Status404 from '../404';
// styles
import styles from './makeGame.scss';

const MakeGame = ({ match }) => {
  return (
    <div className={styles.makeGameContainer}>
      <div className={styles.makeGameContent}>
        <Icon className={styles.makeSlotIcon} icon="MAKE_SLOT" />
        <MakeGameProgress currentStep={parseInt(match.params.step, 10)} />
        <Switch>
          <Route
            path={match.url}
            render={() => {
              if (parseInt(match.params.step, 10) === 1) {
                return <MakeGameFirstStep />;
              } else if (parseInt(match.params.step, 10) === 2) {
                return <MakeGameSecondStep />;
              }
            }}
          />
          <Route component={Status404} />
        </Switch>
      </div>
    </div>
  );
};

export default MakeGame;
