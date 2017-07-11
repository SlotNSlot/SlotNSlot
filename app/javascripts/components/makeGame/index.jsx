import React from 'react';
import { Switch, Route } from 'react-router-dom';
// components
import Icon from '../../icons';
import MakeGameFirstStep from './firstStep';
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
          <Route path={match.url} component={MakeGameFirstStep} />
          <Route component={Status404} />
        </Switch>
      </div>
    </div>
  );
};

export default MakeGame;
