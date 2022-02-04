import React from 'react';
import Grid from '@material-ui/core/Grid';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import BarGraph from '../../Charts/Bar';
import { LightTooltip } from '../../SharedComponents/SharedComponents';
import RangeSlider from '../../SharedComponents/RangeSlider';

const DistributionTile = ({
  data,
  xAxisLabel,
  yAxisLabel,
  ...rest
}) => {
  const [startDistributionSlider, setStartDistributionSlider] = React.useState([0, 100]);
  const [startDistributionStartLabel, setStartDistributionStartLabel] = React.useState('');
  const [startDistributionEndLabel, setStartDistributionEndLabel] = React.useState('');
  const [startGapFilterableData, setStartGapFilterableData] = React.useState([]);
  const [startGapOriginalData, setStartGapOriginalData] = React.useState([]);
  const [range, setRange] = React.useState({
    min: 0,
    max: 100
  });

  React.useEffect(() => {
    setStartGapFilterableData(data?.data?.values);
    setStartGapOriginalData(data?.data?.values);
    // @TODO: Determine what range of values to use to start with
    // @TODO: Merge current and next value to determine range that should be shown on bar graph
    setStartDistributionSlider([data?.data?.values[0].bin, data?.data?.values[data?.data?.values.length - 1].bin]);
    setRange({
      min: data?.data?.values[0].bin,
      max: data?.data?.values[data?.data?.values.length - 1].bin
    });
    setStartDistributionStartLabel(data?.data?.values[0].bin);
    setStartDistributionEndLabel(data?.data?.values[data?.data?.values.length - 1].bin);
  }, [data]);

  React.useEffect(() => {
    const [first, second] = startDistributionSlider;
    setStartDistributionStartLabel(first);
    setStartDistributionEndLabel(second);
  }, [startDistributionSlider]);

  const filterStartDistribution = React.useCallback((_, val) => {
    const [first, second] = val;
    setStartGapFilterableData(startGapOriginalData.filter((values) => values.bin > first && values.bin < second));
    setStartDistributionSlider(val);
  }, [startDistributionSlider]);

  return (
    <React.Fragment>
      {data && (
        <React.Fragment>
          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
            <h4>
              {data?.title}
              <LightTooltip
                placement="top"
                fontSize="small"
                interactive
                arrow
                title={data?.toolTip?.toString().replace(/\b.,\b/g, '. ')}
              >
                <InfoOutlinedIcon
                  style={{ fontSize: 16, margin: '0 0 8px 4px', color: '#8282828' }}
                  className="log-mouseover"
                  id={`info-tooltip-${data?.toolTip?.toString()}`}
                />
              </LightTooltip>
            </h4>
          </div>
          <BarGraph
            height={200}
            data={startGapFilterableData}
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
            singleColour
            colors={['#3DB3E3']}
            margin={{ bottom: 20 }}
          />
          <Grid item xs={12}>
            <RangeSlider
              id="startDistribution"
              step={1}
              min={range.min}
              max={range.max}
              onChange={filterStartDistribution}
              value={startDistributionSlider}
              startLabel={startDistributionStartLabel}
              endLabel={startDistributionEndLabel}
            />
          </Grid>
        </React.Fragment>
      )}
    </React.Fragment>
  );
};

export default DistributionTile;

