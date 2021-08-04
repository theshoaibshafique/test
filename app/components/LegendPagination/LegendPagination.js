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
        bottom: '-15px'
    },
    text: {
        fontSize: 12,
        color: '#0000008A'
    }
}));

const LegendPagination = (props) => {
    const [page, setPage] = useState(1);
    const [pageCount, setPageCount] = useState(1); 
    const [totalHeight, setTotalHeight] = useState(0); 
    const [legendPageData, setLegendPageData] = useState([]);
    const { legendData,  children, chartTitle } = props;
    
    

    useEffect(() => {
      let updatedHeight = 0;
      children.forEach(el => {
        if(el.ref.current) {
          updatedHeight += el.ref.current.clientHeight + 8;
        }
      });

      // calculate how many legend items can fit in legend container and consequently how many items ot have per legend page.
      // Check whether totalHeight is greater than a height slighty smaller than the legend container height of 308 px(270px);
      if(updatedHeight >= 270) {
        let updatedLegendPageData = [];
        let currentTotalHeight = 0;
        let currentCount = 0;
        let lastIndex;
        let temp = children;
        while(temp.length > 0) {
          // Loop over tempChildren (legend items).
          for(let i = 0; currentTotalHeight <= 270 && i < temp.length; i++ ) {
            // 1. add current legend item height to currentTotalHeight.
            currentTotalHeight += temp[i].ref.current.clientHeight + 8;
            // update lastIndex val.
            lastIndex = i;
          }
          // reset currentTotalHeight.
          currentTotalHeight = 0;
          // Get count of how many legend items were looped over in last interation (i.e how many legend items on that legend page).
          currentCount = temp.slice(undefined, lastIndex + 1).length;
          // Update tempChildren for next iteration.
          temp = temp.slice(lastIndex + 1, undefined);
          updatedLegendPageData.push(currentCount);
        }
        setLegendPageData(updatedLegendPageData);
      }
      setTotalHeight(updatedHeight);
    }, [children]);

    // Update pageCount piece of state based on the length of the legendPageData array.
    useEffect(() => {
      let updatedPageCount = 1;
      if(legendPageData.length > 0) updatedPageCount = legendPageData.length;
      // Update pageCount piece of state.
      setPageCount(updatedPageCount);
    }, [legendPageData]);

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
    
    const classes = useStyles();
    // Handle null props.children value.
    if(!children) {
      return <div></div>
    }

    return (
          <React.Fragment>
            {children.slice((page - 1) * legendPageData[page - 1] || undefined, page * legendPageData[page - 1] || undefined)}
            {pageCount > 1 && (
                <div className={classes.root}>
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