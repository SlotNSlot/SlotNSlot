import React from 'react';
import Slider from 'react-slick';
import styles from '../slotList.scss';

class ListHeader extends React.PureComponent {
  render() {
    const settings = {
      dots: false,
      arrows: false,
      infinite: true,
      autoplay: true,
      pauseOnHover: true,
      autoplaySpeed: 5000,
      className: styles.carouselWrapper,
    };

    return (
      <Slider {...settings}>
        <div>
          <div className={styles.background} />
        </div>
        <div>
          <div className={styles.background2}>
            <div className={styles.headerContainer}>
              <div className={styles.headerTitle}>
                <strong>SlotNSlot</strong> is<br />
                The World First <strong>Online Slot Machine</strong>
                <br />
                <strong>Platform</strong>, running on <strong>Ethereum</strong>
              </div>
              <button className={styles.infoButton}>More Information</button>
            </div>
          </div>
        </div>
      </Slider>
    );
  }
}

export default ListHeader;
