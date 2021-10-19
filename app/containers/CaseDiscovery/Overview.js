import { Card } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import { useSelector } from 'react-redux';
import { selectFlagReport, selectSavedCases, selectClipNotificationStatus } from '../App/cd-selectors';
import { useTransition, animated } from "react-spring";
import { Case, EmptyCase, ThumbnailCase } from './Case';
import Icon from '@mdi/react'
import { mdiBellOffOutline, mdiBellRing } from '@mdi/js';
import { DATE_OPTIONS, CLIP_NOTIFICATION_STATUS_TOOLTIPS } from './misc/constants';
import { getTag } from './misc/helper-components';
import { formatCaseForLogs, getPresetDates } from './misc/Utils';
import { makeSelectLogger } from '../App/selectors';
import { LightTooltip } from '../../components/SharedComponents/SharedComponents';
export function Overview(props) {
    const { recentFlags, recentClips, recommendations, recentSaved, overview } = props;
    const flagReport = useSelector(selectFlagReport());
    const clipNotificationStatus = useSelector(selectClipNotificationStatus());
    const { handleChangeCaseId, handleSaveCase, handleFilterChange, handleToggleClipNotification } = props;
    const commonProps = { handleChangeCaseId, handleSaveCase };

    const bellNotificationIcon = (
        <LightTooltip 
            title={
                <React.Fragment>
                    <div style={{marginBottom:4, fontWeight:'bold'}}>
                        {clipNotificationStatus === false ? Object.keys(CLIP_NOTIFICATION_STATUS_TOOLTIPS).find(el => el?.toLowerCase() === 'notification off') : Object.keys(CLIP_NOTIFICATION_STATUS_TOOLTIPS).find(el => el?.toLowerCase() === 'notification on') }
                    </div>
                    <span>{clipNotificationStatus === false ? CLIP_NOTIFICATION_STATUS_TOOLTIPS['Notification Off'] : CLIP_NOTIFICATION_STATUS_TOOLTIPS['Notification On']}</span> 
                </React.Fragment>
            } 
            arrow
        >
            {clipNotificationStatus === false ? 
                <animated.div className="bell-notification" onClick={() => handleToggleClipNotification(clipNotificationStatus)}>
                    <Icon color="#828282" path={mdiBellOffOutline} size={'24px'} />
                </animated.div> :
                <animated.div className="bell-notification" onClick={() => handleToggleClipNotification(clipNotificationStatus)}>
                    <Icon color="#004f6e" path={mdiBellRing} size={'24px'} />
                </animated.div>
            }
        </LightTooltip>
    );

    return (
        <div className="case-discovery-overview">
            <OverviewTile overview={overview} handleFilterChange={handleFilterChange} />
            <div className="carousel-list">
                <CarouselCases
                    cases={recommendations}
                    title="Cases of Interest"
                    {...commonProps}
                    isInfinite />

                <CarouselCases
                    cases={recentSaved}
                    title="Most Recently Saved Cases"
                    message="No Saved Cases"
                    {...commonProps}
                />

                <CarouselCases
                    cases={recentFlags}
                    title="Most Recently Flagged Cases"
                    message={flagReport && (recentFlags?.length) ?
                        "Most Recently Flagged Cases" : "No Flagged Cases"}
                    {...commonProps}
                />
                <CarouselCases
                    cases={recentClips}
                    title={<>Most Recent Flag Clips
                             {bellNotificationIcon}
                           </>
                           }
                    message={(flagReport?.clipsDefault)
                        ? "No Flag Clips" : "Flag Clips Disabled"}
                    {...commonProps}
                    isThumbnail
                />
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
    const logger = useSelector(makeSelectLogger());
    const { cases, rooms, tags } = overview && overview[timeframe] || {
        cases: null, rooms: null, tags: []
    };
    tags.sort((a, b) => b.count - a.count);
    const changeDate = (key) => () => {
        setTimeframe(key);
        logger.manualAddLog('click', `change-date-range-${key}`, overview[key]);
    }
    const handleFilterClick = (event, value) => {
        handleFilterChange(event, value);
        logger.manualAddLog('click', `tag-click-to-browse`, value);
    };
    const isSelectedDate = (key) => key == timeframe ? 'selected' : '';
    const date = { selected: dateMap[timeframe], ...getPresetDates(dateMap[timeframe]) }
    const height = 42;

    const transitions = useTransition(
        tags.map((data, i) => ({ ...data, y: i * height })),
        d => d.name,
        {
            from: { position: "absolute", opacity: 0 },
            leave: { height: 0, opacity: 0 },
            enter: ({ y }) => ({ y, opacity: 1 }),
            update: ({ y }) => ({ y })
        }
    );

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
            <div style={{ height: height * transitions.length, position: 'relative' }}>
                {transitions.map(({ item, props: { y, ...rest }, key }, index) => (
                    <animated.div
                        key={key}
                        className="overview-tag subtext"
                        style={{
                            transform: y.interpolate(y => `translate3d(0,${y}px,0)`),
                            ...rest
                        }}
                    >
                        <span className={`case-tag pointer ${item.name}`} onClick={() => { handleFilterClick('overview', { tags: [item.name], date }) }}>
                            <span>{getTag(item.name)}</span>
                            <div className="display">{item.name}</div>
                        </span>
                        <div style={{ marginLeft: '8px' }}>{item.count}</div>
                    </animated.div>
                ))}
            </div>
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
    const { cases, isThumbnail, isInfinite, title, message } = props;
    const savedCases = useSelector(selectSavedCases());
    const logger = useSelector(makeSelectLogger());
    const { handleChangeCaseId, handleSaveCase } = props;

    const [CASES, setCases] = useState(cases);
    const caseLength = CASES?.length || 0;
    const CAROUSEL_SIZE = 3;
    const hasMinCases = CASES?.length > CAROUSEL_SIZE;
    useEffect(() => {
        if (cases) {
            setCases(cases)
        }
    }, [cases])

    const Controls = ({ next, previous, goToSlide, carouselState, carouselState: { currentSlide, slidesToShow, totalItems }, ...rest }) => {
        if (!totalItems) {
            return ''
        }

        let showLeft = currentSlide > 0;
        slidesToShow = Math.floor(caseLength / CAROUSEL_SIZE) + caseLength % CAROUSEL_SIZE;
        let showRight = (CAROUSEL_SIZE + currentSlide) < caseLength;
        if (caseLength <= CAROUSEL_SIZE && currentSlide > 0) {
            goToSlide(0);
        }
        if (!hasMinCases) {
            showLeft = showRight = false;
        } else if (isInfinite) {
            showLeft = showRight = true;
        }
        
        const prevClick = () => {
            previous();
            const casesToLog = CASES.slice(currentSlide%caseLength-1, (currentSlide%caseLength) + 2).map((c) => formatCaseForLogs(c));
            logger.manualAddLog('click', `${title}-previous-arrow`, casesToLog)
        }
        const nextClick = () => {
            next();
            const casesToLog = CASES.slice(currentSlide%(caseLength)+1, (currentSlide%caseLength) + 4).map((c) => formatCaseForLogs(c));
            logger.manualAddLog('click', `${title}-next-arrow`, casesToLog)
        }
        return (
            <div className="rec-header">
                {showLeft && <div className="left-arrow" onClick={() => prevClick()}></div>}
                {showRight && <div className="right-arrow" onClick={() => nextClick()}></div>}
            </div>
        )
    }
    const renderCase = (c, i) => {
        if (!c) {
            return <EmptyCase message={message} />
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
                handleSaveCase={() => handleSaveCase(c.caseId, c)} />

        }

    }

    return (
        <React.Fragment>
            <div className="title normal-text">
                {title}
            </div>
            <div className="carousel-cases">
                <Carousel
                    className={'carousel'}
                    infinite={isInfinite}
                    showDots={false}
                    responsive={responsive}
                    autoPlay={isInfinite}
                    autoPlaySpeed={6500}
                    arrows={false}
                    renderButtonGroupOutside={true}
                    customButtonGroup={<Controls />}
                >
                    {
                        (caseLength ? CASES : [null]).map((c, i) => renderCase(c, i))
                    }
                </Carousel>

            </div>
        </React.Fragment>
    )
}