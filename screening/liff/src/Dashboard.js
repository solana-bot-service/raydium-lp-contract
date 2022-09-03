import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { Avatar, Chip, Stack, TextField, Typography } from "@mui/material"

import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';


import React, { useEffect, useMemo, useState } from "react";
import { Correlation } from "./Components/UserLog/Graph/corr";
import DataService from "./services/dataservice";

export const DashBoard = function () {


    const [stat, setStat] = useState({});
    const [corrMode, setCorrMode] = useState('age');
    const [corrModeQ3, setCorrModeQ3] = useState('age');
    const [r1, setR1] = useState(0);
    const [r2, setR2] = useState(0);

    const handleChangeCorrMode = (event, mode) => {
        setCorrMode(mode);
      };
      
    const handleChangeCorrModeQ3 = (event, mode) => {
        setCorrModeQ3(mode);
      };


    useEffect(() => {
        function getStat() {
            const ds = new DataService()
            ds.getStat()
                .then(stat => setStat(o => ({ ...o, ...stat })))
        }
        if (!Object.entries(stat).length) getStat()
    }, [stat]);

    return (
        <Stack direction={'column'} spacing={2}>


            <Stack direction='row' spacing={2}>
                
                <Paper elevation={3} sx={{ m:2, p:2, height:120}}>
                    <Typography variant="h6" >จำนวนผู้ทดสอบรวม {stat.total} คน</Typography>
                    {stat.average && (<React.Fragment>
                        <Typography sx={{
                                fontSize: '12px',
                                fontWeight: 500,                                        
                            }}>ค่าเฉลี่ยการรับรู้ {stat.average.q2}</Typography>
                    <Typography sx={{
                                fontSize: '12px',
                                fontWeight: 500,                                        
                            }}>ค่าเฉลี่ยพฤติกรรม {stat.average.q3}</Typography>
                    </React.Fragment>)}
                </Paper>

                <Grid container spacing={1} columns={{ xs: 2, sm: 4, md: 8 }}>
                    {stat.units && Object.entries(stat.units).map(([name, unit], index) => (
                    <Grid item xs={2} sm={4} md={4} key={index}>
                        <Paper elevation={3} sx={{ m:2, p:2}}>
                            <Typography key={'name'+index}>{name}</Typography>
                            <Typography key={'count'+index} variant= 'h4'>{unit.count}</Typography>
                            <Typography sx={{
                                        fontSize: '12px',
                                        fontWeight: 500,                                        
                                    }}>ค่าเฉลี่ยการรับรู้ {stat && stat.unitAverage && stat.unitAverage[name] && stat.unitAverage[name].q2}</Typography>
                            <Typography sx={{
                                        fontSize: '12px',
                                        fontWeight: 500,                                        
                                    }}>ค่าเฉลี่ยพฤติกรรม {stat && stat.unitAverage && stat.unitAverage[name] && stat.unitAverage[name].q3}</Typography>

                        </Paper>
                    </Grid>
                    ))}                    
                </Grid>                

            </Stack>


            <Stack
            direction={{  xs: 'column',  md: 'row' }}
            spacing={{ sm: 2, md: 4 }}
          >


            
            
            <Stack direction={{  xs: 'column',  md: 'row' }} spacing={2} >

            <Stack
                direction='column'>
                    
                <Stack
                direction='row' spacing={2}>
                    
                    <ToggleButtonGroup
                    color="primary"
                    value={corrMode}    
                    exclusive
                    onChange={handleChangeCorrMode}
                    aria-label="Platform"
                    >
                        <ToggleButton value="age">อายุ</ToggleButton>
                        <ToggleButton value="gender">เพศ</ToggleButton>            
                        <ToggleButton value="grade">เกรดเฉลี่ย</ToggleButton>  
                        
                    </ToggleButtonGroup>
                    <Chip avatar={<Avatar>R</Avatar>} label={r1.toFixed(4)} /> 
           
                </Stack>

                <Correlation corrMode={corrMode} q={'q2'} title={'Correlation ปัจจัยรับรู้ในการป้องกันการติดเชื้อโรคโควิด-19'} setR={setR1} />
                {/* <Typography>Correlation ปัจจัยรับรู้ในการป้องกันการติดเชื้อโรคโควิด-19</Typography> */}

            </Stack>
            <Stack
                direction='column'>
                    
                <Stack
                direction='row' spacing={2}>
                    
                    <ToggleButtonGroup
                    color="primary"
                    value={corrModeQ3}    
                    exclusive
                    onChange={handleChangeCorrModeQ3}
                    aria-label="Platform"
                    >
                        <ToggleButton value="age">อายุ</ToggleButton>
                        <ToggleButton value="gender">เพศ</ToggleButton>            
                        <ToggleButton value="grade">เกรดเฉลี่ย</ToggleButton>  
                        
                    </ToggleButtonGroup>
                    <Chip avatar={<Avatar>R</Avatar>} label={r2.toFixed(4)} />
                </Stack>

                <Correlation corrMode={corrModeQ3} q={'q3'} title={'Correlation ปัจจัยพฤติกรรมในการป้องกันการติดเชื้อโรคโควิด-19'} setR={setR2} />
                {/* <Typography>Correlation ปัจจัยพฤติกรรมในการป้องกันการติดเชื้อโรคโควิด-19</Typography> */}
            </Stack>


            </Stack>
            

          </Stack>
        </Stack>
          )
}