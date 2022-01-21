/**
 * NotFoundPage
 *
 * This is the page we show when the user visits a url that doesn't have a route
 */

import React from 'react';
import './style.scss';
import { motion } from 'framer-motion';

export default class Welcome extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  constructor(props) {
    super(props);
    this.ref = React.createRef();
    this.state = {
      animate: true
    };
  }

  componentDidMount() {

  }

  render() {
    const imgSrc = 'https://api.insights.surgicalsafety.com/media/default.png';
    return (
      <div className="welcome-page">
        <motion.div
          className="facility-graphic-container"
          style={{visibility: this.state.animate ? 'visible' : 'hidden' }}
          animate={{
            y: '-100%',
          }}
          transition={{
            delay: 2,
            duration: 2,
          }}
        >
          <div>
            <img src={imgSrc} ref={this.ref}/>
          </div>
        </motion.div>
        <motion.div
          className="facility-graphic-container"
          style={{visibility: this.state.animate ? 'visible' : 'hidden' }}
          animate={{
            y: '-100%',
          }}
          transition={{
            delay: 2,
            duration: 2,
          }}
        >
          <div>
            <img src={imgSrc} ref={this.ref}/>
          </div>
        </motion.div>
        <div
          style={{visibility: 'hidden' }}
          className="facility-graphic-container"
        >
          <img src={imgSrc} ref={this.ref}/>
        </div>

        <motion.div
          className="welcome-message"
          style={{visibility: this.state.animate ? 'visible' : 'hidden' }}
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
          style={{visibility: this.state.animate ? 'visible' : 'hidden' }}
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

        <div className="facility-graphic-container" style={{visibility: !this.state.animate ? 'visible' : 'hidden' }}>
          <img src={imgSrc} ref={this.ref}/>
        </div>
        <div className="welcome-message" style={{visibility: !this.state.animate ? 'visible' : 'hidden' }}>
          <div className="welcome">Welcome</div>
          <div className="personal-name">{this.props.firstName} {this.props.lastName}</div>
        </div>
        <div className="footer subtle-subtext">Can’t find what you’re looking for? Contact your administrator for
          assistance.
        </div>
      </div>
    );
  }
}
