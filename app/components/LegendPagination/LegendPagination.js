import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { IconButton, Typography }from '@material-ui/core';
import { ChevronLeft, ChevronRight, FirstPage, LastPage } from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        flexWrap: 'nowrap',
        alignItems: 'center',
        justifyContent: 'flex-start',
        marginLeft: '16px'
    },
    text: {
        fontSize: 12,
        color: '#0000008A'
    }
}));

const LegendPagination = (props) => {
    const { page, pageCount } = props;
    const classes = useStyles();
  
      return (
        <div className={classes.root}>
          <IconButton
              onClick={() => {}}
              aria-label="first page"
              disabled={page === 1}
              size="small"
          >
              <FirstPage />
          </IconButton>
          <IconButton
              onClick={() => {}}
              aria-label="previous page"
              disabled={page === 1}
              size="small"
          >
              <ChevronLeft />
          </IconButton>
          <Typography variant="body1" className={classes.text}>
              {`${page}/${pageCount}`}
          </Typography>
          <IconButton
              onClick={() => {}}
              aria-label="next page"
              disabled={page === pageCount}
              size="small"
          >
              <ChevronRight />
          </IconButton>
          <IconButton
              onClick={() => {}}
              aria-label="last page"
              disabled={page === pageCount}
              size="small"
          >
              <LastPage />
          </IconButton>
        </div>
      );
};

export default LegendPagination;