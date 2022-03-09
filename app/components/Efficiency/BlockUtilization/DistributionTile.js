import React from 'react';
import Grid from '@material-ui/core/Grid';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import BarGraph from '../../Charts/Bar';
import { LightTooltip } from '../../SharedComponents/SharedComponents';
import RangeSlider from '../../SharedComponents/RangeSlider';
import { Tooltip } from '@material-ui/core';

const DistributionTile = ({
  data, xAxisLabel, yAxisLabel, toolTip, title, ...rest
}) => {
  const [sliderRange, setSliderRange] = React.useState([0, 100]);
  const [filteredData, setFilteredData] = React.useState([]);
  const [originalData, setOriginalData] = React.useState([]);
  const [range, setRange] = React.useState({
    min: 0,
    max: 100
  });

  React.useEffect(() => {
    const { values } = data ?? {}
    // setFilteredData(values);
    setOriginalData(values);
    const startValue = values?.[0]?.bin;
    const endValue = values?.[data?.values.length - 1]?.bin;

    const yValues = values?.map(({ count }) => count) ?? [];
    const indexOfMax = yValues.indexOf(Math.max(...yValues))
    const leftSpan = Math.min(Math.round(yValues.length * .35), 20)
    const rightSpan = Math.min(Math.round(yValues.length * .35), 25)
    const leftEl = values?.[Math.max(indexOfMax - leftSpan, 0)];
    const rightEl = values?.[Math.min(indexOfMax + rightSpan, yValues.length - 1)];
    setSliderRange([leftEl?.bin ?? startValue, rightEl?.bin ?? endValue]);
    setRange({
      min: startValue,
      max: endValue
    });

  }, [data]);


  const filterStartDistribution = React.useCallback((_, val) => {
    setSliderRange(val);
  }, [sliderRange]);

  React.useEffect(() => {
    const { binSize } = data ?? {}
    const [first, second] = sliderRange;
    setFilteredData(originalData?.filter((values) => values.bin >= first && values.bin <= (second + binSize)));
  }, [sliderRange])

  const valueLabelFormat = (value) => `${value} min`;
  const [min, max] = sliderRange ?? [];
  return (
    <React.Fragment>
      {data && (
        <React.Fragment>
          <div className='tile-title' style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
            {title}
            <LightTooltip
              placement="top"
              fontSize="small"
              interactive
              arrow
              title={toolTip?.toString().replace(/\b.,\b/g, '. ')}
            >
              <InfoOutlinedIcon
                style={{ fontSize: 16, margin: '4px', color: '#8282828' }}
                className="log-mouseover"
                id={`info-tooltip-${toolTip?.toString()}`}
              />
            </LightTooltip>
          </div>
          <BarGraph
            height={230}
            data={filteredData}
            binSize={data?.binSize}
            primaryKey="count"
            xAxisLabel={{
              value: xAxisLabel,
              offset: -10,
              position: 'insideBottom'
            }}
            yAxisLabel={{
              value: yAxisLabel,
              angle: -90,
              offset: 15,
              position: 'insideBottomLeft'
            }}
            singleColour={rest?.singleColour}
            dualColour={rest?.dualColour}
            colors={['#3DB3E3']}
            margin={{ bottom: 20, right: 20 }}
          />
          <Grid item xs={12}>
            <RangeSlider
              id="startDistribution"
              step={1}
              min={range.min}
              max={range.max}
              onChange={filterStartDistribution}
              value={sliderRange}
              startLabel={valueLabelFormat(range.min)}
              endLabel={valueLabelFormat(range.max)}
              valueLabelFormat={valueLabelFormat}
              disabled={range.min === undefined || range.max === undefined}
              rangeLabel={`${max - min} min selected`}
            />
          </Grid>
        </React.Fragment>
      )}
    </React.Fragment>
  );
};

export default DistributionTile;
