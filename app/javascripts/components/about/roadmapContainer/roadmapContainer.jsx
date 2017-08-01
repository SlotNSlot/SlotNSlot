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
              Project Initiative<br />Concept Design
            </div>
          </div>
        </div>
        <div className={styles.roadmapBubble}>
          <Icon className={styles.bubbleImage} icon="EVENT_BUBBLE_UP" />
          <div className={styles.bubbleContext}>
            <div className={styles.bubbleTitle}>Q4 2017</div>
            <div className={styles.bubbleText}>Beta Release</div>
          </div>
        </div>
        <div className={`${styles.roadmapBubble} ${styles.roadmapBubbleDown}`}>
          <Icon className={styles.bubbleImage} icon="EVENT_BUBBLE_DOWN" />
          <div className={styles.bubbleContext}>
            <div className={styles.bubbleTitle}>Q3 2017</div>
            <div className={styles.bubbleText}>
              Prototype *Showcase*<br />Crowdsale
            </div>
          </div>
        </div>
        <div className={`${styles.roadmapBubble} ${styles.roadmapBubbleDown}`}>
          <Icon className={styles.bubbleImage} icon="EVENT_BUBBLE_DOWN" />
          <div className={styles.bubbleContext}>
            <div className={styles.bubbleTitle}>Q1 2018</div>
            <div className={styles.bubbleText}>
              Official Release<br />& Further Themes&Features
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>;
export default RoadmapContainer;
