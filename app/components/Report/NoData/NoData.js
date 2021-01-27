import React from 'react';
import { Grid, Tooltip, withStyles } from '@material-ui/core';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';

import './style.scss';
import { NavLink } from 'react-router-dom';

const LightTooltip = withStyles((theme) => ({
  tooltip: {
    boxShadow: theme.shadows[1],
    padding: '16px',
    fontSize: '14px',
    lineHeight: '19px',
    fontFamily: 'Noto Sans'
  }
}))(Tooltip);

export default function NoData(props) {
  return (
    <Grid container spacing={0} className="no-data-tile" direction="column">
      <Grid item xs className="title">
        {props.title}{props.toolTip && <LightTooltip interactive arrow title={Array.isArray(props.toolTip) ? props.toolTip.map((line) => { return <div>{line}</div> }) : props.toolTip} placement="top" fontSize="small">
          <InfoOutlinedIcon style={{ fontSize: 16, margin: '0 0 8px 4px' }} />
        </LightTooltip>}
      </Grid>
      {props.subTitle && <Grid item xs className="subtitle">
        {props.subTitle}
      </Grid>}
      <Grid item xs className="body">
        {props.body}
      </Grid>
      <Grid item xs>
        {props.url && <NavLink to={props.url} className='link'>
          {props.urlText}
        </NavLink>}
      </Grid>
    </Grid>
  )
}