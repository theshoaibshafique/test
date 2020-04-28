import React from 'react';
import { Grid, Tooltip, withStyles } from '@material-ui/core';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';

import './style.scss';

const LightTooltip = withStyles((theme) => ({
    tooltip: {
        // backgroundColor: theme.palette.common.white,
        // color: 'rgba(0, 0, 0, 0.87)',
        boxShadow: theme.shadows[1],
        fontSize: 11,
        padding:'24px 16px',
        fontSize:'14px',
        lineHeight:'19px',
        font:'Noto Sans'
    },
    arrow: {
        // color: theme.palette.common.white,
    },
}))(Tooltip);

export default class ReportScore extends React.PureComponent {
    constructor(props) {
        super(props);
    };

    redirect() {
        this.props.pushUrl(this.props.redirectLink);
    }

    render() {
        return (
            <Grid container spacing={0} justify="center" style={{ textAlign: 'center' }} className="report-score">
                <Grid item xs={12} className="score-title">
                    <span >
                        {this.props.title}
                        <LightTooltip open={true} arrow title={this.props.tooltipText} placement="top" fontSize="small">
                            <InfoOutlinedIcon style={{ fontSize: 16, margin: 'auto 0 ' }} />
                        </LightTooltip>
                    </span>
                </Grid>
                <Grid item xs={12} className="score-display">
                    {this.props.score}
                </Grid>
                {this.props.redirectLink &&
                    <Grid item xs={12} className="link">
                        <a onClick={() => this.redirect()}>{this.props.redirectDisplay}</a>
                    </Grid>
                }
            </Grid>
        );
    }
}