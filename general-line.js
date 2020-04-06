import data from './data.json'

const config = {
  type: 'line',
  data: {
    labels: data.data.map(d => d.date),
    datasets: [
      {
        label: 'Vaka',
        data: data.data.map(d => d.case),
        fill: false,
        borderColor: 'rgba(100, 180, 255, 1)'
      },
      {
        label: 'Test',
        data: data.data.map(d => d.test),
        borderColor: 'rgba(255, 200, 100, 1)',
        fill: false
      },
      {
        label: 'Ölüm',
        data: data.data.map(d => d.death),
        borderColor: 'rgba(255, 0, 0, 1)',
        fill: false
      }
    ]
  },
  options: {
    responsive: true,
    title: {
      display: true,
      text: 'Türkiye - Covid 19'
    },
    tooltips: {
      mode: 'index',
      intersect: false
    },
    hover: {
      mode: 'nearest',
      intersect: true
    },
    scales: {
      xAxes: [{
        display: true,
        scaleLabel: {
          display: true,
          labelString: 'Gün'
        }
      }],
      yAxes: [{
        display: true,
        scaleLabel: {
          display: true,
          labelString: 'Vaka'
        }
      }]
    }
  }
}

export default config
