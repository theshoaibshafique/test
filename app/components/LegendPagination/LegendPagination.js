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
    const { legendData, itemsPerPage, children, chartTitle } = props;
    
    useEffect(() => {
      if(totalHeight > 0) {
        // TODO: Check whether totalHeight is greater than legend container height (308px);

        // Calcuate number of legend pages and update pageCount piece of state.
        // setPageCount(Math.ceil(legendData.length / itemsPerPage));
          // console.log(Math.ceil(totalHeight/308))
          setPageCount(Math.ceil(totalHeight/308));
      }
    }, [totalHeight]);

    useEffect(() => {
      let updatedHeight = 0;
      children.forEach(el => {
        if(el.ref.current) {
          updatedHeight += el.ref.current.clientHeight + 8;
        }
      });
      console.log(updatedHeight);
      setTotalHeight(updatedHeight);
      // console.log(children[0].ref.current.clientHeight)
    }, [])

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
    // console.log(pageCount)
    return (
          <React.Fragment>
            {children.slice((page - 1) * (children.length/pageCount), page * (children.length/pageCount))}
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