import data from './data.json'

const config = {
  type: 'bar',
  data: {
    labels: data.data.map(d => d.date),
    datasets: [
      {
        label: 'Vefat',
        backgroundColor: 'rgba(255, 50, 50, 1)',
        stack: 'Stack 0',
        data: data.data.map(d => d.death)
      },
      {
        label: 'Vaka',
        backgroundColor: 'rgba(50, 200, 50, 1)',
        stack: 'Stack 2',
        data: data.data.map(d => d.case)
      }
    ]
  },
  options: {
    title: {
      display: true,
      text: 'Covid 19 - Vaka, Vefat Sayıları'
    },
    tooltips: {
      mode: 'index',
      intersect: false
    },
    responsive: true,
    scales: {
      xAxes: [
        {
          stacked: true
        }
      ],
      yAxes: [
        {
          stacked: true
        }
      ]
    }
  }
}

export default config
