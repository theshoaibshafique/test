import React from 'react';
import Grid from '@material-ui/core/Grid';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import { LightTooltip } from '../../../components/SharedComponents/SharedComponents';
import RangeSlider from '../../../components/SharedComponents/RangeSlider';
import RadioButtonGroup from '../../../components/SharedComponents/RadioButtonGroup';
import BarGraph from '../../Charts/Bar';

const DistributionTile = ({ data, toolTip, title }) => {
  const barGraphToggleOptions = [
    {
      id: 'turnover',
      value: 'Turnover',
      display: 'Total Turnover'
    },
    {
      id: 'cleanup',
      value: 'Cleanup'
    },
    {
      id: 'idle',
      value: 'Idle'
    },
    {
      id: 'setup',
      value: 'Setup'
    },
  ];
  const [color, setColor] = React.useState('#A77ECD');
  const [graphData, setGraphData] = React.useState('Turnover');
  const [filteredData, setFilteredData] = React.useState([]);
  const [originalData, setOriginalData] = React.useState([]);
  const [sliderRange, setSliderRange] = React.useState([0, 100]);
  const [range, setRange] = React.useState({
    min: 0,
    max: 0
  });

  React.useEffect(() => {
    if (!data) return;
    const min = data[graphData.toLowerCase()][0]?.bin;
    const max = data[graphData.toLowerCase()][data[graphData.toLowerCase()].length - 1]?.bin;
    setRange({
      min,
      max
    });
    // @TODO: Determine what range of values to use to start with
    // @TODO: Merge current and next value to determine range that should be shown on bar graph
    setSliderRange([
      min,
      max
    ]);

    setOriginalData(data[graphData.toLowerCase()]);
    setFilteredData(data[graphData.toLowerCase()]);
  }, [data, graphData]);

  React.useEffect(() => {
    switch (graphData.toLowerCase()) {
      case 'turnover':
        setColor('#A77ECD');
        break;
      case 'cleanup':
        setColor('#97E7B3');
        break;
      case 'idle':
        setColor('#FFC74D');
        break;
      case 'setup':
        setColor('#3DB3E3');
        break;
      default:
        break;
    }
    setOriginalData(data[graphData.toLowerCase()]);
    setFilteredData(data[graphData.toLowerCase()]);
  }, [graphData]);

  const toggleGraphData = (e) => {
    setGraphData(e.target.value);
  };

  // keep filtered range from slider upon update of distribution data
  React.useEffect(() => {
    const { binSize } = data ?? {}
    const [min, max] = sliderRange;
    setFilteredData(originalData.filter((values) => values.bin >= min && values.bin <= (max + binSize)));
  }, [originalData, sliderRange]);

  const filterDistribution = React.useCallback((_, val) => {
    setSliderRange(val);
  }, [sliderRange]);
  const valueLabelFormat = (value) => `${value} min`;
  return (
    <React.Fragment>
      <div className='tile-title' style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
        {title}
        <LightTooltip placement="top" fontSize="small" interactive arrow title={toolTip?.toString()}>
          <InfoOutlinedIcon style={{ fontSize: 16, margin: '4px', color: '#8282828' }} className="log-mouseover" id={`info-tooltip-${toolTip?.toString()}`} />
        </LightTooltip>
      </div>
      <div
        style={{
          display: 'flex', flexDirection: 'row', flex: 1, justifyContent: 'flex-end'
        }}
      >
        <RadioButtonGroup value={graphData} onChange={toggleGraphData} options={barGraphToggleOptions} highlightColour="#004F6E" />
      </div>
      <BarGraph
        height={230}
        data={filteredData}
        binSize={data?.binSize}
        xAxisLabel={{
          value: `${graphData} Duration (min)`,
          offset: -10,
          position: 'insideBottom'
        }}
        yAxisLabel={{
          value: 'Frequency',
          angle: -90,
          offset: 15,
          position: 'insideBottomLeft'
        }}
        singleColour
        margin={{ bottom: 20 }}
        colors={[color]}
      />
      <Grid item xs={12} style={{ marginTop: 10 }}>
        <RangeSlider
          id="duration"
          step={1}
          min={range.min}
          max={range.max}
          onChange={filterDistribution}
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
