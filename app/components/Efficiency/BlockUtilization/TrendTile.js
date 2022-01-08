import React from 'react';
import moment from 'moment';
import Grid from '@material-ui/core/Grid';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import { LightTooltip } from '../../../components/SharedComponents/SharedComponents';
import RangeSlider from '../../../components/SharedComponents/RangeSlider';
import RadioButtonGroup from '../../../components/SharedComponents/RadioButtonGroup';
import LineGraph from '../../Charts/LineGraph';

const TrendTile = ({
  data, handleFilterDates, trendLineData, chartData, toggleChartData, options
}) => {
  const [trendEndDate, setTrendEndDate] = React.useState('');
  const [trendSlider, setTrendSlider] = React.useState([0, 100]);
  const [trendStartDate, setTrendStartDate] = React.useState('');
  const [dateDiff, setDateDiff] = React.useState(0);

  React.useEffect(() => {
    setTrendStartDate(data?.data?.start_date);
    setTrendEndDate(data?.data?.end_date);
    const startDate = moment(data?.data?.start_date);
    const endDate = moment(data?.data?.end_date);
    const diff = endDate.diff(startDate, 'days');
    setDateDiff(diff);
    setTrendSlider([0, diff]);
  }, [data]);

  const filterTrend = React.useCallback((_, val) => {
    const [first, second] = trendSlider;
    // if (val[1] - val[0] <= 5) {
    //   return;
    // }
    if (val[0]) {
      if (val[0] > first) {
        setTrendStartDate((prev) => moment(prev).subtract(1, 'days'));
      } else if (val[0] < first) {
        setTrendStartDate((prev) => moment(prev).add(1, 'days'));
      }
    }
    if (val[1]) {
      if (val[1] > second) {
        setTrendEndDate((prev) => moment(prev).add(1, 'days'));
      } else if (val[1] < second) {
        setTrendEndDate((prev) => moment(prev).subtract(1, 'days'));
      }
    }
    setTrendSlider(val);
  }, [trendSlider]);

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
        data={trendLineData}
        xAxisLabel={{ value: 'Date', offset: -5, position: 'insideBottom' }}
        yAxisLabel={{
          value: 'On Time Start (%)', angle: -90, offset: 15, position: 'insideBottomLeft'
        }}
        xTickMargin={8}
      />
      <Grid item xs={12} style={{ marginTop: 10 }}>
        <RangeSlider
          id="trend"
          min={0}
          max={dateDiff}
          step={1}
          onChange={filterTrend}
          value={trendSlider}
          startLabel={moment(trendStartDate).format('MMM D YYYY')}
          endLabel={moment(trendEndDate).format('MMM D YYYY')}
          onChangeCommitted={() => handleFilterDates(trendStartDate, trendEndDate)}
        />
      </Grid>
    </React.Fragment>
  );
};

export default TrendTile;
