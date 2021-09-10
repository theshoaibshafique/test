import { Card, Grid } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import { useSelector } from 'react-redux';
import { makeSelectToken, makeSelectUserFacility } from '../App/selectors';
import { Case, ThumbnailCase } from './Case';
import { getTag } from './misc/helper-components';
export function Overview(props) {
    const { recentFlags, recentClips, recommendations, savedCases, recentSaved, overview } = props;
    const {handleChangeCaseId, handleSaveCase} = props;
    const commonProps = {handleChangeCaseId, handleSaveCase, savedCases};
    const [showCarousel, setShowCarousel] = React.useState(true);
    // useEffect(() => {
    //     setTimeout(()=>{
    //         setShowCarousel(true);
    //     },3000)
    // },[])
    return (
        <div className="case-discovery-overview">
            <div>
                {overview && <OverviewTile overview={overview} />}
            </div>
            <div className="carousel-list" style={showCarousel ? {} : {opacity:0}}>
                <div className="title normal-text">Recommended Cases</div>
                <CarouselCases cases={recommendations} {...commonProps} isInfinite/>

                <div className="title normal-text">Recently Flagged Cases</div>
                <CarouselCases cases={recentFlags} {...commonProps} />

                <div className="title normal-text">Saved Cases</div>
                <CarouselCases cases={recentSaved} {...commonProps} isInfinite/>

                <div className="title normal-text">Recently Flagged Clips</div>
                <CarouselCases cases={recentClips} {...commonProps} isThumbnail />
            </div>
        </div>
    )
}

function OverviewTile(props) {
    const { overview } = props;
    const [timeframe, setTimeframe] = React.useState('month');
    const { cases, rooms, tags } = overview && overview[timeframe] || {
        cases: null, rooms: null, tags: []
    };
    const changeDate = (key) => () => setTimeframe(key);
    const isSelectedDate = (key) => key == timeframe ? 'selected' : '';
    return (
        <Card variant="outlined" className="overview-tile">
            <div className="title normal-text">OVERVIEW</div>
            <div className="date-options">
                <div className={`subtle-text ${isSelectedDate('week')}`} onClick={changeDate('week')}>Past week</div>
                <div className={`subtle-text ${isSelectedDate('month')}`} onClick={changeDate('month')}>Past month</div>
                <div className={`subtle-text ${isSelectedDate('year')}`} onClick={changeDate('year')}>Past year</div>
                <div className={`subtle-text ${isSelectedDate('all')}`} onClick={changeDate('all')}>All</div>
            </div>
            <div className="overview-info subtext">
                <div className="bold subtle-subtext">Total Cases</div>
                <div>{cases}</div>
            </div>
            <div className="overview-info subtext">
                <div className="bold subtle-subtext">Operating Rooms</div>
                <div>{rooms}</div>
            </div>
            <div className="title normal-text">TAGS</div>
            {tags.map((t) => (
                <div className="overview-tag subtext">
                    <span className={`case-tag ${t.name}`}>
                        <span>{getTag(t.name)}</span>
                        <div className="display">{t.name}</div>
                    </span>
                    <div>{t.count}</div>
                </div>
            ))}
        </Card>
    )
}

const responsive = {
    desktop: {
        breakpoint: { max: 3000, min: 1280 },
        items: 3,
        slidesToSlide: 1 // optional, default to 1.
    },
    tablet: {
        breakpoint: { max: 1280, min: 464 },
        items: 2,
        slidesToSlide: 1 // optional, default to 1.
    },
    mobile: {
        breakpoint: { max: 464, min: 0 },
        items: 1,
        slidesToSlide: 1 // optional, default to 1.
    }
};

function CarouselCases(props) {
    const { handleChangeCaseId, cases, savedCases, handleSaveCase, isThumbnail, isInfinite } = props;
    const [CASES, setCases] = useState([]);
    
    useEffect(() => {
        if (!cases) {
            return;
        }
        setCases(cases);
    }, [cases])

    const Controls = ({ next, previous, goToSlide, carouselState, carouselState: { currentSlide, slidesToShow, totalItems }, ...rest }) => {

        if (!totalItems) {
            return ''
        }
        return (
            <div className="rec-header">
                {(isInfinite || currentSlide > 0) && <div className="left-arrow" onClick={() => previous()}></div>}
                {(isInfinite || slidesToShow * currentSlide < totalItems) && <div className="right-arrow" onClick={() => next()}></div>}
            </div>
        )
    }
    const renderCase = (c, i) => {

        if (isThumbnail) {
            return <ThumbnailCase
                key={i}
                onClick={() => handleChangeCaseId(c.caseId)}
                {...c}
                isSaved={savedCases.includes(c.caseId)}
                handleSaveCase={() => handleSaveCase(c.caseId)}
            />
        } else {
            return <Case
                isShort
                key={i}
                onClick={() => handleChangeCaseId(c.caseId)}
                {...c}
                isSaved={savedCases.includes(c.caseId)}
                handleSaveCase={() => handleSaveCase(c.caseId)} />

        }

    }

    return (<div className="carousel-cases">

        <Carousel
            className={'carousel'}
            // id="carousel" // default ''
            infinite={isInfinite}
            showDots={false}
            responsive={responsive}
            // autoPlay={true}
            autoPlaySpeed={6500}
            arrows={false}
            renderButtonGroupOutside={true}
            customButtonGroup={<Controls />}
        >
            {
                CASES.map((c, i) => renderCase(c, i))
            }
        </Carousel>

    </div>)
}