import React from 'react';
import PropTypes from 'prop-types';
import { ResponsiveContainer, BarChart as RechartsBarChart, XAxis, YAxis, Tooltip,
  Bar, PieChart as RechartsPieChart, Pie, Legend, Cell } from 'recharts';

export const BarChart = props => (
  <ResponsiveContainer width="100%" height={300}>
    <RechartsBarChart data={props.data}>
      <YAxis />
      <XAxis dataKey={props.xKey} />
      <Tooltip />
      <Bar dataKey={props.yKey} fill="#555555" />
    </RechartsBarChart>
  </ResponsiveContainer>
);

BarChart.propTypes = {
  data: PropTypes.array.isRequired,
  xKey: PropTypes.string.isRequired,
  yKey: PropTypes.string.isRequired
};

export const PieChart = props => (
  <ResponsiveContainer width="100%" height={300}>
    <RechartsPieChart>
      <Pie data={props.data} dataKey={props.yKey} nameKey={props.xKey}>
        {props.data.map(datum => <Cell key={datum.title} fill={datum.fill} />)}
      </Pie>
      <Tooltip />
      <Legend align="right" layout="vertical" verticalAlign="middle" />
    </RechartsPieChart>
  </ResponsiveContainer>
);

PieChart.propTypes = {
  data: PropTypes.array.isRequired,
  xKey: PropTypes.string.isRequired,
  yKey: PropTypes.string.isRequired
};
