import React, { useEffect, useMemo, useRef, useState } from 'react';
import ApexCharts from 'apexcharts';
import Chart from 'react-apexcharts';
import DataService from '../../../services/dataservice';
import { Avatar, Chip, Stack, TextField, Typography } from "@mui/material"

import regression from 'regression';


export const Correlation = function (props) {

    const {corrMode ,q ,title, setR} = props

    const [options, setOptions] = useState({});
    const [series, setSeries] = useState([]);
    const [x, setX] = useState(0);

    const result = useMemo(() => {
      if (series[0]) return regression.linear(series[0].data, 
                            {
                              precision: 2,
                            })
      return {equation: [0, 0]}
  }, [series]);
  console.log(result);
  const gradient = result.equation[0];
  const yIntercept = result.equation[1];
  const y = useMemo(() => {
    console.log(x);
    
    return x * gradient + yIntercept
  }, [gradient, x, yIntercept])

  function handleXChange(newValue) {
    // event.preventDefault
    setX(newValue)
  }
    useEffect(() => {

      var options = {
        chart: {
        height: 350,
        type: 'scatter',
        zoom: {
          enabled: true,
          type: 'xy'
        }
      },
      xaxis: {
        tickAmount: 10,
        labels: {
          formatter: function(val) {
            if (isNaN(parseFloat(val))) return val
            return parseFloat(val).toFixed(1)
          }
        }
      },
      yaxis: {
        tickAmount: 7
      },
      title: {
        text: title, offsetY: 20,
      }
      };


        setOptions(options)

        async function getCoor() {
          const ds = new DataService()
          let func = q ==='q2' ? ds.getCoor : ds.getCoorQ3
          func(corrMode)
          .then( coorData => {

            setSeries(coorData)
            if (coorData[0].correlation) setR(coorData[0].correlation)

          })
        }
        getCoor()

    }, [corrMode, q, setR, title]);
    return (
        <React.Fragment>
          
          <Chart options={options} series={series} type="scatter" width={500} height={320} />
          <Stack direction={'row'}>

          <Chip avatar={<Avatar>y=</Avatar>} label={y.toFixed(2)} />
          <TextField id="regression" label="Regression" variant="outlined" defaultValue={x} onChange={(e) => {
        handleXChange(e.target.value);
      }} />
            <Stack direction={'column'}>
                          
              <Chip avatar={<Avatar>a</Avatar>} label={gradient} />
              <Chip avatar={<Avatar>b</Avatar>} label={yIntercept} />
            </Stack>
            <Chip avatar={<Avatar>MSE</Avatar>} color="warning"  label={series && series[0] && series[0].mse.toFixed(2) + '%'} />
          </Stack>


        </React.Fragment>
      )

}