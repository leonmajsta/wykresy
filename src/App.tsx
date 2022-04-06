import { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import soccerData2 from './scores2.json'
import 'chartjs-plugin-datalabels';
import 'chartjs-plugin-labels';
// import fifa from './fifa-scores.json'


type GameInfo = {
  date: string,
  home_team: string,
  away_team: string,
  home_score: number,
  away_score: number,
  tournament: string,
  city: string,
  country: string,
  neutral: boolean
}

type SocerData = {
  team: string,
  wins: number,
  matches: number,
  goal_difference: number,
  win_ratio: number,
  goal_difference_average: number
  continent:string
}

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top' as const,
    },
    title: {
      display: true,
      text: 'International football matches data from 1872-2021',
    },
     datalabels: {
        // color: 'white',
        display: function(context) {
          return 'https://upload.wikimedia.org/wikipedia/commons/9/9a/Flag_of_Afghanistan.svg';
        },
        // font: {
        //   weight: 'bold'
        // },
        // formatter: Math.round
      }
  },
};

// const config = {
//   type: 'bar',
//   data: {
//     labels: [],
//     datasets: [{
//       backgroundColor: Utils.color(0),
//       data: Utils.numbers({
//         count: DATA_COUNT,
//         min: 0,
//         max: 100
//       }),
//       datalabels: {
//         align: 'end',
//         anchor: 'start'
//       }
//     }, {
//       backgroundColor: Utils.color(1),
//       data: Utils.numbers({
//         count: DATA_COUNT,
//         min: 0,
//         max: 100
//       }),
//       datalabels: {
//         align: 'center',
//         anchor: 'center'
//       }
//     }, {
//       backgroundColor: Utils.color(2),
//       data: Utils.numbers({
//         count: DATA_COUNT,
//         min: 0,
//         max: 100
//       }),
//       datalabels: {
//         anchor: 'end',
//         align: 'start',
//       }
//     }]
//   },
//   options: {
//     plugins: {
//       datalabels: {
//         color: 'white',
//         display: function(context) {
//           return context.dataset.data[context.dataIndex] > 15;
//         },
//         font: {
//           weight: 'bold'
//         },
//         formatter: Math.round
//       }
//     },

//     // Core options
//     aspectRatio: 5 / 3,
//     layout: {
//       padding: {
//         top: 24,
//         right: 16,
//         bottom: 0,
//         left: 8
//       }
//     },
//     elements: {
//       line: {
//         fill: false
//       },
//       point: {
//         hoverRadius: 7,
//         radius: 5
//       }
//     },
//     scales: {
//       x: {
//         stacked: true
//       },
//       y: {
//         stacked: true
//       }
//     }
//   }
// }


const selectOptions = [{ value: 'win_ratio', label: 'Win ratio' }, { value: 'goal_difference_average', label: 'Goal difference AVG' }, { value: 'matches', label: 'Most games' }, { value: 'wins', label: 'Most wins' }, { value: 'goal_difference', label: 'Biggest goal difference' }]
const continents = [...new Map(soccerData2.map((item) => [item["continent"], { value: item.continent, label: item.continent }])).values()];

export function App() {
  const [selectedOption, setSelectedOption] = useState(selectOptions[0].value);
  const [selectedContinent, setSelectedContinent] = useState(continents[0].label);


  const [countries, setCountries] = useState(soccerData2.map(item => item.team).slice(0,9))
  const [flags, setFlags] = useState(soccerData2.map(item => item.team).slice(0,9))
  const [results, setResults] = useState([])
  const [label, setLabel] = useState('Win Ratio')




const opt = {
    plugins: {
      labels: {
        render: 'image',
        textMargin: 10,
        images: [
          {
            src: 'https://i.stack.imgur.com/9EMtU.png',
            width: 20,
            height: 20
          },
          null, 
          {
            src: 'https://i.stack.imgur.com/9EMtU.png',
            width: 20,
            height: 20
          },
          null
        ]
      }
    },
    layout: {
      padding: {
        top: 30
      }
    },
    legend: {
      display: false
    },
    scales: {
      yAxes: [{
        ticks: {
          beginAtZero: true
        }
      }]
    }
  }



  const handleChange = (value, selectOptionSetter) => {

    if (selectOptions.filter(o => o.value === value)[0]) {
      setLabel(selectOptions.filter(o=>o.value===value)[0]?.label)
    }
    selectOptionSetter(value)
  }
  
  const data = {
    labels:countries,
    datasets: [
      {
        label,
        data:results,
        backgroundColor: 'rgba(3, 201, 169, 0.5)',
        // datalabels: {
        //   align: 'center',
        //   anchor: 'center'
        // }
      }
    ],
  };
  
  useEffect(() => {
    console.log(selectedOption);
    const res = soccerData2.filter(sd => sd.continent === selectedContinent).map(sd => { return { key: sd.team, value: sd[`${selectedOption}`] } }).sort((a, b) => b.value - a.value).splice(0, 10)
    
    setResults(res.map(sd => { return sd.value }))
    setCountries(res.map(sd => { return sd.key }))
    
  },[selectedContinent,selectedOption])
  

  return (
    <div>
      <label >Metric:</label>
      <select
          value={selectedOption}
          onChange={e => handleChange(e.target.value, setSelectedOption)}>
          {selectOptions.map(o => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      <label >Continent:</label>
      <select
          value={selectedContinent}
          onChange={e => handleChange(e.target.value, setSelectedContinent)}>
          {continents.map(o => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
        <Bar options={options} data={data} />
        {/* <HorizontalBar options={ config.options}/> */}
    </div>
  )
}
