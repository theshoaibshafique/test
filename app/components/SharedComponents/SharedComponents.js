import React, { useEffect } from 'react';
import { Tooltip, withStyles } from '@material-ui/core';

export const LightTooltip = withStyles((theme) => ({
    tooltip: {
        boxShadow: theme.shadows[1],
        padding: '16px',
        fontSize: '14px',
        lineHeight: '19px',
        fontFamily: 'Noto Sans'
    }
}))(Tooltip);