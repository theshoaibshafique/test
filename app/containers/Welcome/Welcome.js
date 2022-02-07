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
  facilityGraphicRatio = 1920 / 1161;

  constructor(props) {
    super(props);
    this.ref = React.createRef();
    this.container = React.createRef();
    const animate = (new URLSearchParams(this.props.location.search).get('animate') === 'true') ?? false;
    const currentFacilityId = new URLSearchParams(this.props.location.search).get('currentFacilityId') ?? null;
    const newFacilityId = new URLSearchParams(this.props.location.search).get('newFacilityId') ?? props.userFacility;
    /**
     * useLargeSizeClass initialization uses a hack to calculate from window size instead of container size initially
     * the resize handler fail at the beginning
     * without this hack, whenever animation occurs without the concern of the container size
     */
    this.state = {
      animate,
      currentFacilityId,
      newFacilityId,
      useLargeSizeClass: (window.innerWidth / window.innerHeight) >= this.facilityGraphicRatio
    };
    window.history.pushState({}, document.title, window.location.pathname);
    window.addEventListener('resize', this.resizeHandler.bind(this));
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

  shouldComponentUpdate(nextProps, nextState, nextContext) {
    this.resizeHandler();
    return true;
  }

  resizeHandler(){
    console.log("resizeHandler");
    if(this.container.current){
      const {width, height} =this.container.current.getBoundingClientRect();
      const shouldUseClass = (width / height >= this.facilityGraphicRatio);
      console.log(width, height);
      console.log(shouldUseClass);
      if(this.state.useLargeSizeClass !== shouldUseClass){
        this.setState({
          useLargeSizeClass: shouldUseClass
        });
      }
    }
  }

  renderAnimatedContainer(animate) {
    const currentFacility = this.props.facilityDetails[this.state.currentFacilityId];
    const newFacility = this.props.facilityDetails[this.state.newFacilityId];
    if(animate){
      return (
        <div className={`container ${this.state.useLargeSizeClass ? "large-size-class": "small-size-class"}`} id={Math.random()}>
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
        <div className={`container ${this.state.useLargeSizeClass ? "large-size-class": "small-size-class"}`}>
          <div className="facility-graphic-container" style={{display: !animate ? 'flex' : 'none' }}>
            <div ref={this.container} className="facility-graphic-container__img-container">
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
