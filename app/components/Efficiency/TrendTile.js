import React from 'react';
import moment from 'moment';
import Grid from '@material-ui/core/Grid';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import { LightTooltip } from '../../components/SharedComponents/SharedComponents';
import RangeSlider from '../../components/SharedComponents/RangeSlider';
import RadioButtonGroup from '../../components/SharedComponents/RadioButtonGroup';
import LineGraph from '../Charts/LineGraph';
import useLocalStorage from '../../hooks/useLocalStorage';
const DAY_MS = 86400000;
const TrendTile = ({
  data, trendLineData, chartData, toggleChartData, options
}) => {
  const [trendSlider, setTrendSlider] = React.useState([0, 100]);
  const [date, setDate] = React.useState({
    start: '',
    end: ''
  });

  //Range of the default Area
  const [range, setRange] = React.useState({
    min: 0,
    max: 0
  });
  const [filteredTrendData, setFilteredTrendData] = React.useState([]);
  const { getItemFromStore } = useLocalStorage();
  //Update line - without updating slider or area range
  React.useEffect(() => {
    filterTrend(null, trendSlider)
  }, [trendLineData]);

  //If data changes - we assume APPLY was clicked and we re-set ranges
  React.useEffect(() => {
    const startDate = moment(data?.data?.startDate).valueOf();
    const endDate = moment(data?.data?.endDate).valueOf();

    const config = getItemFromStore('globalFilter');
    const min = config?.startDate ? moment(config?.startDate).valueOf() + 86400000 : null;
    const max = config?.endDate ? moment(config?.endDate).valueOf() : null;
    setRange({
      min,
      max
    });

    const start = config?.startDate ? moment(config?.startDate).valueOf() : startDate;
    const end = config?.endDate ? moment(config?.endDate).valueOf() : endDate;
    setTrendSlider([start, end]);
  }, [data]);

  React.useEffect(() => {
    const [first, last] = trendSlider;
    const start = moment(first).valueOf();
    const end = moment(last).valueOf();

    setFilteredTrendData(trendLineData?.filter((values) =>
      moment(values.date).isBetween(start, end)
    ) ?? []);

    setDate({
      start,
      end
    });
  }, [trendSlider]);

  const filterTrend = (_, val) => {
    setFilteredTrendData(trendLineData?.filter((values) =>
      moment(values.date).isBetween(date.start, date.end)
    ));
    setTrendSlider(val);
  };
  const valueLabelFormat = (value) => moment(value).format('MMM D YYYY');

  //Max range
  const startDate = moment(data?.data?.startDate).valueOf();
  const endDate = moment(data?.data?.endDate).valueOf();


  const [sliderStart, sliderEnd] = trendSlider;
  //Get rough # of visible months
  const visibleMonths = (sliderEnd - sliderStart) / (30 * DAY_MS);
  return !!data && (
    <React.Fragment>
      <div
        className='tile-title'
        style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}
      >
        {data?.title}
        <LightTooltip placement="top" fontSize="small" interactive arrow title={Array.isArray(data?.toolTip) ? data?.toolTip?.map((text) => (<div key={text.charAt(Math.random() * text.length)}>{text}</div>)) : data?.toolTip}>
          <InfoOutlinedIcon style={{ fontSize: 16, margin: '4px', color: '#8282828' }} className="log-mouseover" id={`info-tooltip-${data?.toolTip?.toString()}`} />
        </LightTooltip>
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
        interval={visibleMonths > 24 ? 60 : 30}
        data={filteredTrendData}
        xAxisLabel={{ value: data.independentVarTitle, offset: -5, position: 'insideBottom' }}
        yAxisLabel={{
          value: data.dependentVarTitle, angle: -90, offset: 15, position: 'insideBottomLeft'
        }}
        areaReference={(range.max <= sliderStart) ? [] : [Math.max(range.min, sliderStart), Math.min(range.max, sliderEnd)]}
        xTickMargin={8}
      />
      <Grid item xs={12} style={{ marginTop: 10 }}>
        <RangeSlider
          min={startDate}
          max={endDate}
          step={DAY_MS}
          onChange={filterTrend}
          value={trendSlider}
          startLabel={valueLabelFormat(date.start)}
          endLabel={valueLabelFormat(date.end)}
          valueLabelFormat={valueLabelFormat}
        />
      </Grid>
    </React.Fragment>
  );
};

export default TrendTile;
