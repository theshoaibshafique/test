import React from 'react';
import { makeStyles, CircularProgress } from '@material-ui/core';

import './style.scss';

const useStylesCircleProgress = makeStyles({
    root: {
      textAlign: 'center',
      color: '#000000',
      '& h3' : {
        fontSize: '18px',
        fontWeight: 'unset',
        opacity: 0.8
      },
      '& h5' : {
        fontSize: '42px',
        opacity: 0.8,
        fontWeight: 'normal',
        position: 'absolute',
        width: '100%',
        margin: 0,
        top: 55,
        '& sup' : {
          fontSize: '14px',
          top: '-1.5rem'
        }
      }
    },
    circlewrapper: {
      position: 'relative',
    },
    topcircle: {
      color: '#F3F3F3',
    },
    bottomcircle: {
      color: props => props.color,
      animationDuration: '550ms',
      position: 'absolute',
      left: 0,
    },
  });

export default function CircleProgress(props) {
  const classes = useStylesCircleProgress(props);

  return(
    <div className={classes.root}>
      <h3>{props.title}</h3>
      <div className={classes.circlewrapper}>
        <CircularProgress
          variant="static"
          value={100}
          className={classes.topcircle}
          size={props.size}
          thickness={5}
        />
        <CircularProgress
          variant="static"
          className={classes.bottomcircle}
          size={props.size}
          thickness={5}
          {...props}
        />
        <h5>{props.value}<sup>%</sup></h5>
      </div>
    </div>
  )
}