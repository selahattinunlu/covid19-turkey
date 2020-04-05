import data from './data.json'

const finalData = {
    labels: [],
    percentages: []
}

data.data.forEach(d => {
    if (d.test < 1) {
        return
    }

    finalData.labels.push(d.date)
    finalData.percentages.push(
        ((d.case / d.test) * 100).toFixed(2)
    )
})

var config = {
    type: 'line',
    data: {
        labels: finalData.labels,
        datasets: [
            {
                label: 'Oran',
                data: finalData.percentages,
                fill: false,
                borderColor: 'rgba(100, 180, 255, 1)'
            },
        ]
    },
    options: {
        responsive: true,
        title: {
            display: true,
            text: 'Türkiye - Covid 19 - Vaka Test Oranı'
        },
        tooltips: {
            mode: 'index',
            intersect: false,
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
                    labelString: 'Oran'
                }
            }]
        }
    }
};

export default config;