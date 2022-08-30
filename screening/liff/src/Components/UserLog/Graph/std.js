import React, { useEffect, useRef, useState } from 'react';
import ApexCharts from 'apexcharts';
import Chart from 'react-apexcharts';

export const STD = function () {
    
    
    const [options, setOptions] = useState({});
    const [series, setSeries] = useState([]);

    useEffect(() => {
        setOptions({
            chart: {
              id: 'apexchart-example'
            },
            xaxis: {
              categories: [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999]
            }
          })

          setSeries([{
            name: 'series-1',
            data: [30, 40, 35, 50, 49, 60, 70, 91, 125]
          }])
        return () => {
            
        };
        
    }, []);
    return (
        <Chart options={options} series={series} type="bar" width={500} height={320} />
      )

}