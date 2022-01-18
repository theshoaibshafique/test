import React from 'react';
import moment from 'moment';
import Grid from '@material-ui/core/Grid';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import { LightTooltip } from '../../components/SharedComponents/SharedComponents';
import RangeSlider from '../../components/SharedComponents/RangeSlider';
import RadioButtonGroup from '../../components/SharedComponents/RadioButtonGroup';
import LineGraph from '../Charts/LineGraph';

const TrendTile = ({
  data, trendLineData, chartData, toggleChartData, options
}) => {
  const [trendSlider, setTrendSlider] = React.useState([0, 100]);
  const [date, setDate] = React.useState({
    start: '',
    end: ''
  });
  const [range, setRange] = React.useState({
    min: 0,
    max: 0
  });
  const [filteredTrendData, setFilteredTrendData] = React.useState([]);

  React.useEffect(() => {
    setFilteredTrendData(trendLineData);
  }, [trendLineData]);

  React.useEffect(() => {
    const startDate = moment(data?.data?.start_date).valueOf();
    const endDate = moment(data?.data?.end_date).valueOf();

    setRange({
      min: startDate,
      max: endDate
    });

    setDate({
      start: startDate,
      end: endDate
    });
    setTrendSlider([startDate, endDate]);
  }, [data]);

  React.useEffect(() => {
    const [first, last] = trendSlider;
    setDate({
      start: moment(first).valueOf(),
      end: moment(last).valueOf()
    });
  }, [trendSlider]);

  const filterTrend = (_, val) => {
    setFilteredTrendData(trendLineData.filter((values) =>
      moment(values.date).isBetween(date.start, date.end)
    ));
    setTrendSlider(val);
  };

  return !!data && (
    <React.Fragment>
      <div
        style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}
      >
        <h4>
          { data?.title }
          <LightTooltip placement="top" fontSize="small" interactive arrow title={Array.isArray(data?.toolTip) ? data?.toolTip?.map((text) => (<div key={text.charAt(Math.random() * text.length)}>{text}</div>)) : data?.toolTip}>
            <InfoOutlinedIcon style={{ fontSize: 16, margin: '0 0 8px 4px', color: '#8282828' }} className="log-mouseover" id={`info-tooltip-${data?.toolTip?.toString()}`} />
          </LightTooltip>
        </h4>
      </div>
      <div
        style={{
          display: 'flex', flexDirection: 'row', flex: 1, justifyContent: 'flex-end'
        }}
      >
        <RadioButtonGroup value={chartData} onChange={toggleChartData} options={options} highlightColour="#004F6E" />
      </div>
      <LineGraph
        xTickSize={0}
        interval={30}
        data={filteredTrendData}
        xAxisLabel={{ value: 'Date', offset: -5, position: 'insideBottom' }}
        yAxisLabel={{
          value: 'On Time Start (%)', angle: -90, offset: 15, position: 'insideBottomLeft'
        }}
        xTickMargin={8}
      />
      <Grid item xs={12} style={{ marginTop: 10 }}>
        <RangeSlider
          min={range.min}
          max={range.max}
          step={86400}
          onChange={filterTrend}
          value={trendSlider}
          startLabel={moment(date.start).format('MMM D YYYY')}
          endLabel={moment(date.end).format('MMM D YYYY')}
        />
      </Grid>
    </React.Fragment>
  );
};

export default TrendTile;
