import React from 'react';
import Grid from '@material-ui/core/Grid';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import { LightTooltip } from '../../../components/SharedComponents/SharedComponents';
import RangeSlider from '../../SharedComponents/RangeSlider';
import BarGraph from '../../Charts/Bar';

const DistributionTile = ({
  data, xAxisLabel, yAxisLabel, toolTip, title, threshold, ...rest
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
    setOriginalData(values);
    const startValue = values?.[0]?.bin;
    const endValue = values?.[data?.values.length - 1]?.bin;

    const yValues = values?.map(({ fcotsCount, otsCount }) => fcotsCount + otsCount) ?? [];
    const indexOfMax = yValues.indexOf(Math.max(...yValues))
    //Find the peak of the values and show 15% left and right of it or a min of 15 bins
    const leftSpan = Math.max(Math.round(yValues.length * .15), 10)
    const rightSpan = Math.max(Math.round(yValues.length * .15), 10)
    const leftEl = values?.[Math.max(indexOfMax - leftSpan, 0)];
    const rightEl = values?.[Math.min(indexOfMax + rightSpan, yValues.length - 1)];
    setSliderRange([leftEl?.bin ?? startValue, rightEl?.bin ?? endValue]);
    setRange({
      min: startValue,
      max: endValue
    });
  }, [data, rest.viewFirstCase]);

  const filterStartDistribution = React.useCallback((_, val) => {
    setSliderRange(val);
  }, [sliderRange]);
  React.useEffect(() => {
    const { binSize } = data ?? {}
    const [first, second] = sliderRange;
    setFilteredData(originalData.filter((values) => values.bin >= first && values.bin <= (second + binSize)));
  }, [sliderRange])
  const valueLabelFormat = (value) => `${value} min`;
  return (
    <React.Fragment>
      <div
        className='tile-title'
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center'
        }}
      >
        {title}
        <LightTooltip placement="top" fontSize="small" interactive arrow title={Array.isArray(toolTip) ? toolTip.map((text) => (<div key={text.charAt(Math.random() * text.length)}>{text}</div>)) : toolTip}>
          <InfoOutlinedIcon style={{ fontSize: 16, margin: '4px', color: '#8282828' }} className="log-mouseover" id={`info-tooltip-${toolTip.toString()}`} />
        </LightTooltip>
      </div>
      <BarGraph
        height={230}
        stacked={rest?.viewFirstCase}
        primaryKey={rest?.viewFirstCase ? 'fcotsCount' : 'otsCount'}
        secondaryKey={rest?.viewFirstCase ? 'otsCount' : 'fcotsCount'}
        data={filteredData}
        binSize={data?.binSize}
        xAxisLabel={{
          value: xAxisLabel,
          offset: -10,
          position: 'insideBottom',
        }}
        yAxisLabel={{
          value: yAxisLabel,
          angle: -90,
          offset: 15,
          position: 'insideBottomLeft'
        }}
        dualColour={rest?.dualColour}
        threshold={threshold}
        colors={['#3DB3E3']}
        margin={{ bottom: 20, right: 20 }}
      />
      <Grid item xs={12}>
        <RangeSlider
          id="caseOnTimeDistribution"
          step={1}
          min={range.min}
          max={range.max}
          onChange={filterStartDistribution}
          value={sliderRange}
          startLabel={valueLabelFormat(range.min)}
          endLabel={valueLabelFormat(range.max)}
          valueLabelFormat={valueLabelFormat}
          disabled={range.min === undefined || range.max === undefined}
        />
      </Grid>
    </React.Fragment>
  );
};

export default DistributionTile;
