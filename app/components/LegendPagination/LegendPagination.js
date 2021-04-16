import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { IconButton, Typography }from '@material-ui/core';
import { ChevronLeft, ChevronRight, FirstPage, LastPage } from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        flexWrap: 'nowrap',
        alignItems: 'center',
    },
    text: {
        fontSize: 12
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
          >
              <FirstPage />
          </IconButton>
          <IconButton
              onClick={() => {}}
              aria-label="previous page"
              disabled={page === 1}
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
          >
              <ChevronRight />
          </IconButton>
          <IconButton
              onClick={() => {}}
              aria-label="last page"
              disabled={page === pageCount}
          >
              <LastPage />
          </IconButton>
        </div>
      );
};

export default LegendPagination;