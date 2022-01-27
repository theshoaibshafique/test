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

  // // TODO get facility data
  // async getUserManagementData() {
  //   const assignableRoles = await helperFetch(`${process.env.USER_V2_API}assignable_roles`, 'get', this.props.userToken, {})
  //   this.props.setAssignableRoles(assignableRoles);
  //
  // }

  render() {
    console.log(this.props.facilitySwitch);
    let animate = this.props.facilitySwitch?.isUpdated ?? false;
    let imgSrc;
    if(animate){
      imgSrc = this.props.facilitySwitch.facility.imageSource;
    } else {
      imgSrc = 'https://api.insights.surgicalsafety.com/media/default.png';
    }
    return (
      <div className="welcome-page">
        {/*with animation*/}
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
          <div>
            <img src={imgSrc} ref={this.ref}/>
          </div>
        </motion.div>
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
          <div>
            <img src={imgSrc} ref={this.ref}/>
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

        {/*without animation*/}
        <div className="facility-graphic-container" style={{display: !animate ? 'flex' : 'none' }}>
          <div>
            <img src={imgSrc} ref={this.ref}/>
          </div>
        </div>
        <div className="welcome-message" style={{visibility: !animate ? 'visible' : 'hidden' }}>
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
