import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { IconButton, Typography }from '@material-ui/core';
import { ChevronLeft, ChevronRight, FirstPage, LastPage } from '@material-ui/icons';
import { LightTooltip } from '../SharedComponents/SharedComponents'

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        flexWrap: 'nowrap',
        alignItems: 'center',
        justifyContent: 'flex-start',
        marginLeft: '16px',
        position: 'absolute',
    },
    text: {
        fontSize: 12,
        color: '#0000008A'
    }
}));

const LegendPagination = (props) => {
    const [page, setPage] = useState(1);
    const [pageCount, setPageCount] = useState(1); 
    const { legendData, itemsPerPage, children, chartTitle } = props;
    
    useEffect(() => {
      if(legendData) {
        // Calcuate number of legend pages and update pageCount piece of state.
        setPageCount(Math.ceil(legendData.length / itemsPerPage));
      }
    }, [legendData.length]);

    /*** LEGEND PAGE CHANGE EVENT HANDLER ***/
    const onPageChange = (buttonName) => {
        switch(buttonName) {
            case 'first':
                setPage(1);
                break;
            case 'last':
                setPage(pageCount);
                break;
            case 'prev':
            case 'next':
                setPage(prevPage => buttonName === 'prev' ? prevPage - 1 : prevPage + 1);
            default:
                return;
        }
    };

    // Calculate absolute position of legend pagination element based on chart title.
    const calcPaginationPosition = () => {
      let position;
      // Check if chartTitle prop is null.
      if(!chartTitle) {
        position = '0px';
      }
      // conditionally set position prop for legend pagination based on chartTitle prop value.
      position = chartTitle === 'Total Cases' ? '-24px' : '0px';
      return position;
    };
    
    const classes = useStyles();
    // Handle null props.children value.
    if(!children) {
      return <div></div>
    }
    return (
          <React.Fragment>
            {children.slice((page - 1) * itemsPerPage, page * itemsPerPage)}
            {pageCount > 1 && (
                <div className={classes.root} style={{ bottom: calcPaginationPosition() }}>
                  <LightTooltip title="First Page">
                    <div>
                      <IconButton
                        onClick={() => onPageChange('first')}
                        aria-label="first page"
                        disabled={page === 1}
                        size="small"
                      >
                        <FirstPage />
                      </IconButton>
                    </div>
                  </LightTooltip>
                  <LightTooltip title="Previous Page">
                    <div>
                      <IconButton
                        onClick={() => onPageChange('prev')}
                        aria-label="previous page"
                        disabled={page === 1}
                        size="small"
                      >
                        <ChevronLeft />
                      </IconButton>
                    </div>
                  </LightTooltip>
                  <Typography variant="body1" className={classes.text}>
                      {`${page}/${pageCount}`}
                  </Typography>
                  <LightTooltip title="Next Page" >
                    <div>
                      <IconButton
                        onClick={() => onPageChange('next')}
                        aria-label="next page"
                        disabled={page === pageCount}
                        size="small"
                      >
                        <ChevronRight />
                      </IconButton>
                    </div>
                  </LightTooltip>
                  <LightTooltip title="Last Page">
                    <div>
                      <IconButton
                          onClick={() => onPageChange('last')}
                          aria-label="last page"
                          disabled={page === pageCount}
                          size="small"
                          >
                          <LastPage />
                      </IconButton>
                    </div>
                  </LightTooltip>
                </div>
            )}
        </React.Fragment>
      );
};

export default LegendPagination;