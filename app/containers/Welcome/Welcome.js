/**
 * NotFoundPage
 *
 * This is the page we show when the user visits a url that doesn't have a route
 */

import React from 'react';
import './style.scss';
import { motion } from 'framer-motion';
import { helperFetch } from '../AdminPanel/helpers';

export default class Welcome extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  constructor(props) {
    super(props);
    this.ref = React.createRef();
  }

  componentDidMount() {
    /**
     * get profile facility
     * get facility data
     * get facility graphic image
     */
    console.log(this.props);
  }

  render() {
    console.log(this.props.facilitySwitch);
    let animate = this.props.facilitySwitch?.isUpdated ?? false;
    const defaultImgSrc = 'https://api.insights.surgicalsafety.com/media/default.png';
    let currentFacilityImgSrc = this.props.facilitySwitch?.currentFacility.imageSource ?? defaultImgSrc;
    let container = '';
    if(animate){
      const newFacilityImgSrc = this.props.facilitySwitch.newFacility.imageSource;
      container = (
        <div className="container" id={Math.random()}>
          {/*with animation*/}
          {/*current facility graphic*/}
          <motion.div
            className="facility-graphic-container animate"
            style={{display: animate ? 'flex' : 'none' }}
            animate={{
              y: '-100%',
            }}
            transition={{
              delay: 2,
              duration: 2,
            }}
          >
            <div className="facility-graphic-container__img-container">
              <img src={currentFacilityImgSrc} ref={this.ref}/>
            </div>
          </motion.div>
          {/*new facility graphic*/}
          <motion.div
            className="facility-graphic-container animate"
            style={{display: animate ? 'flex' : 'none' }}
            animate={{
              y: '-100%',
            }}
            transition={{
              delay: 2,
              duration: 2,
            }}
          >
            <div className="facility-graphic-container__img-container">
              <img src={newFacilityImgSrc} ref={this.ref}/>
            </div>
          </motion.div>

          <motion.div
            className="welcome-message"
            style={{visibility: animate ? 'visible' : 'hidden' }}
            initial={{ opacity: 1 }}
            animate={{
              y: '-100%',
              opacity: 0
            }}
            transition={{
              duration: 2,
            }}
          >
            <div className="welcome">Welcome</div>
            <div className="personal-name">{this.props.firstName} {this.props.lastName}</div>
          </motion.div>
          <motion.div
            className="welcome-message"
            style={{visibility: animate ? 'visible' : 'hidden' }}
            initial={{ opacity: 0 }}
            animate={{
              opacity: 1
            }}
            transition={{
              delay: 4,
              duration: 2,
            }}
          >
            <div className="welcome">Welcome</div>
            <div className="personal-name">{this.props.firstName} {this.props.lastName}</div>
          </motion.div>
        </div>
      );
    } else {
      container = (
      <div className="container">
        <div className="facility-graphic-container" style={{display: !animate ? 'flex' : 'none' }}>
          <div className="facility-graphic-container__img-container">
            <img src={currentFacilityImgSrc} ref={this.ref}/>
          </div>
        </div>
        <div className="welcome-message" style={{visibility: !animate ? 'visible' : 'hidden' }}>
          <div className="welcome">Welcome</div>
          <div className="personal-name">{this.props.firstName} {this.props.lastName}</div>
        </div>
      </div>
      );
    }

    return (
      <div className="welcome-page">
        {container}
        <div className="footer subtle-subtext">Can’t find what you’re looking for? Contact your administrator for
          assistance.
        </div>
      </div>
    );
  }
}
