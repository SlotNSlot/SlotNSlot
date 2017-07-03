import React from 'react';
import styles from './roadmapContainer.scss';
import Icon from '../../../icons';

const RoadmapContainer = () =>
  <div className={styles.roadmapContainer}>
    <div className={styles.innerContainer}>
      <div className={styles.roadmapTitle}>Roadmap</div>
      <div className={styles.bubbleBlock}>
        <div className={styles.roadmapBubble}>
          <Icon className={styles.bubbleImage} icon="EVENT_BUBBLE_UP" />
          <div className={styles.bubbleContext}>
            <div className={styles.bubbleTitle}>Q1-2 2017</div>
            <div className={styles.bubbleText}>
              Dev initiative<br />Core development
            </div>
          </div>
        </div>
        <div className={styles.roadmapBubble}>
          <Icon className={styles.bubbleImage} icon="EVENT_BUBBLE_UP" />
          <div className={styles.bubbleContext}>
            <div className={styles.bubbleTitle}>Q4 2017</div>
            <div className={styles.bubbleText}>Beta release</div>
          </div>
        </div>
        <div className={`${styles.roadmapBubble} ${styles.roadmapBubbleDown}`}>
          <Icon className={styles.bubbleImage} icon="EVENT_BUBBLE_DOWN" />
          <div className={styles.bubbleContext}>
            <div className={styles.bubbleTitle}>Q3 2017</div>
            <div className={styles.bubbleText}>
              Prototype release<br />Crowdsale
            </div>
          </div>
        </div>
        <div className={`${styles.roadmapBubble} ${styles.roadmapBubbleDown}`}>
          <Icon className={styles.bubbleImage} icon="EVENT_BUBBLE_DOWN" />
          <div className={styles.bubbleContext}>
            <div className={styles.bubbleTitle}>Q1 2018</div>
            <div className={styles.bubbleText}>
              Official release<br />& dev of further features
            </div>
          </div>
        </div>
        {/*<div className={styles.roadmapBubble}>roadmapBubble</div>
        <div className={styles.roadmapBubble}>roadmapBubble</div>
        <div className={styles.roadmapBubble}>roadmapBubble</div>*/}
      </div>
    </div>
  </div>;
export default RoadmapContainer;

// EVENT_BUBBLE_UP
// EVENT_BUBBLE_DOWN
// http://slot-n-slot-assets.s3.amazonaws.com/about/time-line.png
//  <Icon className={styles.logo} icon="SLOT_N_SLOT_LOGO" />
// import Icon from '../../../icons';
