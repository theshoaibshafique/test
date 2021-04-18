import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { IconButton, Typography }from '@material-ui/core';
import { ChevronLeft, ChevronRight, FirstPage, LastPage } from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        flexWrap: 'nowrap',
        alignItems: 'center',
        justifyContent: 'flex-start',
        marginLeft: '16px',
        position: 'absolute',
        bottom: '-20px',
    },
    text: {
        fontSize: 12,
        color: '#0000008A'
    }
}));

const LegendPagination = (props) => {
    const [page, setPage] = useState(1);
    const [pageCount, setPageCount] = useState(1); 
    const [itemsPerPage, setItemsPerPage] = useState(props.itemsPerPage)
    const { legendData, children } = props;
    
    useEffect(() => {
        // Calcuate number of legend pages and update pageCount piece of state.
        setPageCount(Math.ceil(props.legendData.length / itemsPerPage));
    }, [props.legendData.length]);

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
    return (
          <React.Fragment>
            {children.slice((page - 1) * itemsPerPage, page * itemsPerPage)}
            {pageCount > 1 && (
                <div className={classes.root}>
                    <IconButton
                        onClick={() => onPageChange('first')}
                        aria-label="first page"
                        disabled={page === 1}
                        size="small"
                        >
                        <FirstPage />
                    </IconButton>
                    <IconButton
                        onClick={() => onPageChange('prev')}
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
                        onClick={() => onPageChange('next')}
                        aria-label="next page"
                        disabled={page === pageCount}
                        size="small"
                        >
                        <ChevronRight />
                    </IconButton>
                    <IconButton
                        onClick={() => onPageChange('last')}
                        aria-label="last page"
                        disabled={page === pageCount}
                        size="small"
                        >
                        <LastPage />
                    </IconButton>
                </div>
            )}
        </React.Fragment>
      );
};

export default LegendPagination;