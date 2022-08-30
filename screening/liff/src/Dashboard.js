import { Stack, Typography } from "@mui/material"
import { useEffect, useState } from "react";
import { Correlation } from "./Components/UserLog/Graph/corr";
import { STD } from "./Components/UserLog/Graph/std"
import { single_rank_units } from "./config"
import DataService from "./services/dataservice";

export const DashBoard = function () {


    const [stat, setStat] = useState({});

    useEffect(() => {
        function getStat() {
            const ds = new DataService()
            ds.getStat()
                .then(o => setStat({ ...o, ...stat }))
        }
        if (!Object.entries(stat).length) getStat()
    }, [stat]);

    return (
        <Stack
            direction={{  xs: 'column',  md: 'row' }}
            spacing={{ sm: 2, md: 4 }}
          >

            
            <Stack
            direction='column'>
                <Typography variant="h6" >จำนวนผู้ทดสอบ 400 คน</Typography>
                {/* {Object.entries(stat).map(([key, unit]) => (<Typography key={key}>{unit.name} {unit.count}</Typography>))} */}

            </Stack>
            
            <Stack
            direction='column'>
                
            <Correlation />
            <STD />
            </Stack>


            <Stack
            direction='column'>
                
            <STD />
            <STD />
            </Stack>
            

          </Stack>
          )
}