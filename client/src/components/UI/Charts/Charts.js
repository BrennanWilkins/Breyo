import React from 'react';
import PropTypes from 'prop-types';
import { ResponsiveContainer, BarChart as RechartsBarChart, XAxis, YAxis, Tooltip,
  Bar, PieChart as RechartsPieChart, Pie, Legend, Cell, CartesianGrid } from 'recharts';
import './Charts.css';
import classes from './Charts.module.css';

const pieColors = ['#f05544', '#0079bf', '#489a3c', '#f09000', '#a24dc6', '#F5DD2A', '#3783FF', '#da5fac'];

const CustomTooltip = ({ active, payload, label }) => (
  active && payload && payload.length ?
    <div className={classes.Tooltip}>
      <div className={classes.TooltipLabel}>{label || payload[0].name}</div>
      <div className={classes.TooltipContent}>
        cards: {payload[0].value}
      </div>
    </div>
  : null
);

export const BarChart = React.memo(props => (
  <ResponsiveContainer width="100%" height={300}>
    <RechartsBarChart data={props.data}>
      <YAxis allowDecimals={false} />
      <XAxis dataKey={props.xKey} tick={{ fontSize: 13 }} />
      <CartesianGrid vertical={false} strokeDasharray="3 3" />
      <Tooltip content={<CustomTooltip />} />
      <Bar dataKey="cards" fill="#555555" />
    </RechartsBarChart>
  </ResponsiveContainer>
));

BarChart.propTypes = {
  data: PropTypes.array.isRequired,
  xKey: PropTypes.string.isRequired
};

export const PieChart = React.memo(props => (
  <ResponsiveContainer width="100%" height={300}>
    <RechartsPieChart>
      {props.randomFill ?
        <Pie data={props.data} dataKey="cards" nameKey={props.xKey}>
          {props.data.map((datum, i) => <Cell key={i} fill={pieColors[i % pieColors.length]} />)}
        </Pie>
        :
        <Pie data={props.data} dataKey="cards" nameKey={props.xKey} />
      }
      <Tooltip content={<CustomTooltip />} />
      <Legend align="right" layout="vertical" verticalAlign="middle" />
    </RechartsPieChart>
  </ResponsiveContainer>
));

PieChart.propTypes = {
  data: PropTypes.array.isRequired,
  xKey: PropTypes.string.isRequired,
  randomFill: PropTypes.bool
};
