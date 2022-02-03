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
  graphicSlideInDelay = 0;
  graphicSlideInDuration = 2;
  welcomeMessageSlideOutDelay = 2;
  welcomeMessageFadeInDelay = 2;
  welcomeMessageFadeInDuration = 2;

  constructor(props) {
    super(props);
    this.ref = React.createRef();
    const animate = (new URLSearchParams(this.props.location.search).get('animate') === 'true') ?? false;
    const currentFacilityId = new URLSearchParams(this.props.location.search).get('currentFacilityId') ?? null;
    const newFacilityId = new URLSearchParams(this.props.location.search).get('newFacilityId') ?? props.userFacility;
    this.state = {
      animate,
      currentFacilityId,
      newFacilityId
    };
    window.history.pushState({}, document.title, window.location.pathname);
  }

  componentDidMount() {
    setTimeout(()=>{
      this.setState({
        animate: false
      })
    }, this.totalAnimationDuration());
  }

  totalAnimationDuration() {
    return (this.welcomeMessageFadeInDelay + this.welcomeMessageFadeInDuration) * 1000;
  }

  checkIfFacilityChanged(){
    return this.state.animate && this.state.currentFacilityId !== this.state.newFacilityId;
  }

  renderAnimatedContainer(animate) {
    const currentFacility = this.props.facilityDetails[this.state.currentFacilityId];
    const newFacility = this.props.facilityDetails[this.state.newFacilityId];
    if(animate){
      return (
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
              delay: this.graphicSlideInDelay,
              duration: this.graphicSlideInDuration,
            }}
          >
            <div className="facility-graphic-container__img-container">
              <img src={currentFacility?.imageSource} ref={this.ref}/>
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
              delay: this.graphicSlideInDelay,
              duration: this.graphicSlideInDuration,
            }}
          >
            <div className="facility-graphic-container__img-container">
              <img src={newFacility.imageSource} ref={this.ref}/>
            </div>
          </motion.div>

          <motion.div
            className="welcome-message"
            style={{visibility: animate ? 'visible' : 'hidden' }}
            initial={{ opacity: 0 }}
            animate={{
              y: '-100%',
              opacity: 0
            }}
            transition={{
              duration: this.welcomeMessageSlideOutDelay,
            }}
          >
            <div className="welcome">Welcome</div>
            <div className="personal-name">{this.props.firstName}</div>
          </motion.div>
          <motion.div
            className="welcome-message"
            style={{visibility: animate ? 'visible' : 'hidden' }}
            initial={{ opacity: 0 }}
            animate={{
              opacity: 1
            }}
            transition={{
              delay: this.welcomeMessageFadeInDelay,
              duration: this.welcomeMessageFadeInDuration,
            }}
          >
            <div className="welcome">Welcome</div>
            <div className="personal-name">{this.props.firstName}</div>
          </motion.div>
        </div>
      );
    } else {
      return (
        <div className="container">
          <div className="facility-graphic-container" style={{display: !animate ? 'flex' : 'none' }}>
            <div className="facility-graphic-container__img-container">
              <img src={newFacility.imageSource} ref={this.ref}/>
            </div>
          </div>
          <div className="welcome-message" style={{visibility: !animate ? 'visible' : 'hidden' }}>
            <div className="welcome">Welcome</div>
            <div className="personal-name">{this.props.firstName}</div>
          </div>
        </div>
      );
    }
  }

  render() {
    // return <div />;
    let animate = this.checkIfFacilityChanged(this.props.facilitySwitch) ?? false;
    const container = this.renderAnimatedContainer(animate);

    return (
      <div className="welcome-page">
        {container}
      </div>
    );
  }
}
