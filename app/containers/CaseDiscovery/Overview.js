import { Card, Grid } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import { useSelector } from 'react-redux';
import { makeSelectToken, makeSelectUserFacility } from '../App/selectors';
import { Case, EmptyCase, ThumbnailCase } from './Case';
import { DATE_OPTIONS } from './misc/constants';
import { getTag } from './misc/helper-components';
import { getPresetDates } from './misc/Utils';
export function Overview(props) {
    const { recentFlags, recentClips, recommendations, savedCases, recentSaved, overview } = props;
    const { handleChangeCaseId, handleSaveCase, handleFilterChange } = props;
    const commonProps = { handleChangeCaseId, handleSaveCase, savedCases };
    return (
        <div className="case-discovery-overview">
            <div>
                <OverviewTile overview={overview} handleFilterChange={handleFilterChange} />
            </div>
            <div className="carousel-list">
                <CarouselCases
                    cases={recommendations}
                    title="Recommended Cases"
                    {...commonProps}
                    isInfinite />

                <CarouselCases
                    cases={recentFlags}
                    title="Recently Flagged Cases"
                    message="No Recently Flagged Cases"
                    {...commonProps}
                />

                <CarouselCases
                    cases={recentSaved}
                    title="Saved Cases"
                    message="No Saved Cases"
                    {...commonProps}
                    isInfinite />

                <CarouselCases
                    cases={recentClips}
                    title="Recently Flagged Clips"
                    message="No Recently Flagged Clips"
                    {...commonProps}
                    isThumbnail />
            </div>
        </div>
    )
}

const dateMap = {
    all: DATE_OPTIONS[0],
    week: DATE_OPTIONS[1],
    month: DATE_OPTIONS[2],
    year: DATE_OPTIONS[3]
}

function OverviewTile(props) {
    const { overview, handleFilterChange } = props;
    const [timeframe, setTimeframe] = React.useState('month');
    const { cases, rooms, tags } = overview && overview[timeframe] || {
        cases: null, rooms: null, tags: []
    };
    tags.sort((a, b) => b.count - a.count);
    const changeDate = (key) => () => setTimeframe(key);
    const isSelectedDate = (key) => key == timeframe ? 'selected' : '';
    const date = {selected: dateMap[timeframe], ...getPresetDates(dateMap[timeframe])}
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
                    <span className={`case-tag pointer ${t.name}`} onClick={() => {handleFilterChange('overview', {tags:[t.name], date })}}>
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
    const { cases, savedCases, isThumbnail, isInfinite, title, message } = props;
    const { handleChangeCaseId, handleSaveCase } = props;
    const caseLength = cases && cases.length || 0;
    const hasMinCases = cases.length > 3;
    const [CASES, setCases] = useState(cases);
    if (!caseLength){
        cases.push(null)
    }


    const Controls = ({ next, previous, goToSlide, carouselState, carouselState: { currentSlide, slidesToShow, totalItems }, ...rest }) => {
        if (!totalItems) {
            return ''
        }
        let showLeft = currentSlide > 0;
        let showRight = slidesToShow * currentSlide < totalItems;
        if (!hasMinCases) {
            showLeft = showRight = false;
        } else if (isInfinite) {
            showLeft = showRight = true;
        }
        return (
            <div className="rec-header">
                {showLeft && <div className="left-arrow" onClick={() => previous()}></div>}
                {showRight && <div className="right-arrow" onClick={() => next()}></div>}
            </div>
        )
    }
    const renderCase = (c, i) => {
        if (!c){
            return <EmptyCase message={message}/>
        } if (isThumbnail) {
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

    return (
        <React.Fragment>
            <div className="title normal-text">{title}</div>
            <div className="carousel-cases">
                <Carousel
                    className={'carousel'}
                    infinite={isInfinite}
                    showDots={false}
                    responsive={responsive}
                    autoPlay={true}
                    autoPlaySpeed={6500}
                    arrows={false}
                    renderButtonGroupOutside={true}
                    customButtonGroup={<Controls />}
                >
                    {
                        CASES.map((c, i) => renderCase(c, i))
                    }
                </Carousel>

            </div>
        </React.Fragment>
    )
}