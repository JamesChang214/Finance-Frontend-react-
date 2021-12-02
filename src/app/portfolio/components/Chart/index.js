import React, {Component} from 'react';
import { Doughnut } from 'react-chartjs-2';
import { throttle } from 'lodash';

const a = (el) => {
  console.log(el);
};

const options = {
  animation: {
    easing: 'linear',
  },
  title: false,
  legend: false,
  tooltips: false,
  cutoutPercentage: 49,
  responsive: true,
  showTooltips: true,
  labels: true,
};

class ChartComponent extends Component {
  chart;

  getChartData = () => {
    const { labels, walletData } = this.props;
    if (labels && walletData && labels.length === walletData.length) {
      const data = {
        labels,
        datasets: [{
          data: walletData,
          fill: true,
          backgroundColor: [
            '#586cb4',
            '#9a87ff',
            '#879dff',
            '#87cbff',
            '#87e7ff',
            '#dc87ff',
          ],
          borderColor: [
            '#586cb4',
            '#9a87ff',
            '#879dff',
            '#87cbff',
            '#87e7ff',
            '#dc87ff',
          ],
          borderWidth: 0,
        }]
      };

      return {
        data,
        getData: (canvas) => {
          canvas.onmousemove = throttle(this.getActiveElement, 200);
          return data;
        }
      };
    }
    return null;
  }

  getActiveElement = (elem) => {
    if (this.chart) {
      const activePoints = this.chart.chartInstance.getElementAtEvent(elem);
      if (activePoints[0] && activePoints[0]._chart && Number.isInteger(activePoints[0]._index)) {
        const chartData = activePoints[0]._chart.config.data;
        const idx = activePoints[0]._index;

        const label = chartData.labels[idx];
        const value = chartData.datasets[0].data[idx];

        const { setActiveElement } = this.props;
        setActiveElement(label, value);
      }
    }
  }

  render() {
    const data = this.getChartData();
    const { activeElement } = this.props;
    return data && (
      <div className="main-chart-container">
        {activeElement && (
          <div className="select-wrapper">
            <span className="select-amount">{activeElement.value}%</span>
            <span className="select-text">{activeElement.label}</span>
          </div>
        )}
        <div className="chart-container">
          <Doughnut
            data={data.getData}
            options={options}
            width={430}
            height={430}
            onHover={a}
            ref={element => this.chart = element}
          />
        </div>
      </div>
    );
  }
}

export default ChartComponent;
