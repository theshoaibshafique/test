import React from 'react';
import Grid from '@material-ui/core/Grid';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import { LightTooltip } from '../../../components/SharedComponents/SharedComponents';
import RangeSlider from '../../../components/SharedComponents/RangeSlider';
import RadioButtonGroup from '../../../components/SharedComponents/RadioButtonGroup';
import BarGraph from '../../Charts/Bar';

const DistributionTile = ({ data }) => {
  const barGraphToggleOptions = [
    {
      id: 1,
      value: 'Turnover'
    },
    {
      id: 2,
      value: 'Cleanup'
    },
    {
      id: 3,
      value: 'Idle'
    },
    {
      id: 4,
      value: 'Setup'
    },
  ];
  const [color, setColor] = React.useState('#A77ECD');
  const [graphData, setGraphData] = React.useState('Turnover');
  const [filteredDistributionData, setFilteredDistributionData] = React.useState([]);
  const [originalDistributionData, setOriginalDistributionData] = React.useState([]);
  const [distributionLabel, setDistributionLabel] = React.useState({
    start: '',
    end: ''
  });
  const [distributionSlider, setDistributionSlider] = React.useState([0, 100]);
  const [range, setRange] = React.useState({
    min: 0,
    max: 0
  });

  React.useEffect(() => {
    if (!data) return;
    setRange({
      min: data?.data[graphData.toLowerCase()][0].bin,
      max: data?.data[graphData.toLowerCase()][data?.data[graphData.toLowerCase()].length - 1].bin
    });
    // @TODO: Determine what range of values to use to start with
    // @TODO: Merge current and next value to determine range that should be shown on bar graph
    setDistributionSlider([
      data?.data[graphData.toLowerCase()][0].bin,
      data?.data[graphData.toLowerCase()][data?.data[graphData.toLowerCase()].length - 1].bin
    ]);
    setDistributionLabel((prev) => ({
      ...prev,
      start: data?.data[graphData.toLowerCase()][0].bin,
      end: data?.data[graphData.toLowerCase()][data?.data[graphData.toLowerCase()].length - 1].bin
    }));
  }, [data]);

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
    setOriginalDistributionData(data?.data[graphData.toLowerCase()]);
    setFilteredDistributionData(data?.data[graphData.toLowerCase()]);
  }, [graphData]);

  const toggleGraphData = (e) => {
    setGraphData(e.target.value);
  };

  React.useEffect(() => {
    const [first, second] = distributionSlider;
    setDistributionLabel({
      start: first,
      end: second
    });
  }, [distributionSlider]);

  // keep filtered range from slider upon update of distribution data
  React.useEffect(() => {
    const [first, second] = distributionSlider;
    setFilteredDistributionData(originalDistributionData.filter((values) => values.bin > first && values.bin < second));
  }, [originalDistributionData, distributionSlider]);

  const filterDistribution = React.useCallback((_, val) => {
    setDistributionSlider(val);
  }, [distributionSlider]);

  return (
    <React.Fragment>
      <div className='tile-title' style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
        {data?.title}
        <LightTooltip placement="top" fontSize="small" interactive arrow title={data?.toolTip?.toString()}>
          <InfoOutlinedIcon style={{ fontSize: 16, margin: '4px', color: '#8282828' }} className="log-mouseover" id={`info-tooltip-${data?.toolTip?.toString()}`} />
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
        height={200}
        data={filteredDistributionData}
        xAxisLabel={{
          value: 'Turnover Duration (min)',
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
          value={distributionSlider}
          startLabel={distributionLabel.start}
          endLabel={distributionLabel.end}
        />
      </Grid>
    </React.Fragment>
  );
};

export default DistributionTile;
