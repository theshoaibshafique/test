import React from 'react';
import Grid from '@material-ui/core/Grid';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import { LightTooltip } from '../../../components/SharedComponents/SharedComponents';
import RangeSlider from '../../SharedComponents/RangeSlider';
import BarGraph from '../../Charts/Bar';

const DistributionTile = ({
  data, xAxisLabel, yAxisLabel, ...rest
}) => {
  const [distributionFilterableData, setDistributionFilterableData] = React.useState([]);
  const [originalDistributionData, setOriginalDistributionData] = React.useState([]);
  const [startDistributionSlider, setStartDistributionSlider] = React.useState([0, 100]);
  const [startDistributionStartLabel, setStartDistributionStartLabel] = React.useState('');
  const [startDistributionEndLabel, setStartDistributionEndLabel] = React.useState('');
  const [range, setRange] = React.useState({
    min: 0,
    max: 100
  });

  React.useEffect(() => {
    if (rest?.viewFirstCase) {
      setDistributionFilterableData(data.data.fcots);
      setOriginalDistributionData(data.data.fcots);
      setStartDistributionSlider([data.data.fcots[0].bin, data.data.fcots[data.data.fcots.length - 1].bin]);
      setRange({
        min: data.data.fcots[0].bin,
        max: data.data.fcots[data.data.fcots.length - 1].bin
      });
      setStartDistributionStartLabel(data.data.fcots[0].bin);
      setStartDistributionEndLabel(data.data.fcots[data.data.fcots.length - 1].bin);
    } else {
      setDistributionFilterableData(data.data.ots);
      setOriginalDistributionData(data.data.ots);
      setStartDistributionSlider([data.data.ots[0].bin, data.data.ots[data.data.ots.length - 1].bin]);
      setRange({
        min: data.data.ots[0].bin,
        max: data.data.ots[data.data.ots.length - 1].bin
      });
      setStartDistributionStartLabel(data.data.ots[0].bin);
      setStartDistributionEndLabel(data.data.ots[data.data.ots.length - 1].bin);
    }
  }, [data, rest.viewFirstCase]);

  React.useEffect(() => {
    const [first, second] = startDistributionSlider;
    setStartDistributionStartLabel(first);
    setStartDistributionEndLabel(second);
  }, [startDistributionSlider]);

  const filterStartDistribution = React.useCallback((_, val) => {
    const [first, second] = val;
    setDistributionFilterableData(originalDistributionData.filter((values) => values.bin > first && values.bin < second));
    setStartDistributionSlider(val);
  }, [startDistributionSlider]);

  return (
    <React.Fragment>
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center'
        }}
      >
        <h4>{data.title}</h4>
        <LightTooltip placement="top" fontSize="small" interactive arrow title={Array.isArray(data.toolTip) ? data.toolTip.map((text) => (<div key={text.charAt(Math.random() * text.length)}>{text}</div>)) : data.toolTip}>
          <InfoOutlinedIcon style={{ fontSize: 16, margin: '0 0 8px 4px', color: '#8282828' }} className="log-mouseover" id={`info-tooltip-${data.toolTip.toString()}`} />
        </LightTooltip>
      </div>
      <BarGraph
        height={200}
        data={distributionFilterableData}
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
        dualColour={rest?.dualColour}
        colors={['#3DB3E3']}
        margin={{ bottom: 20 }}
      />
      <Grid item xs={12}>
        <RangeSlider
          id="caseOnTimeDistribution"
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
  );
};

export default DistributionTile;
