import React, { useEffect, useRef, useState } from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DoNotDisturbAltIcon from '@mui/icons-material/DoNotDisturbAlt';
import BlockIcon from '@mui/icons-material/Block';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { stringAvatar, toRelative } from '../../App';
import { Divider, ListSubheader, Stack, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';

export default function TestResult(props) {
    let { results } = props
    const [timeLabels, setTimeLabels] = useState([]);
    const [filters, setFilters] = useState([true, false]);
    const refreshTimer = useRef(null)
    const [filteredResults, setFilteredResults] = useState({});

    useEffect(() => {

      if (!Object.entries(filteredResults).length) return
      if (refreshTimer.current) clearInterval(refreshTimer.current)

      function run() {
        setTimeLabels(() => Object.entries(filteredResults)
        .map(([_, result]) => toRelative(result.date)))
      }
      run()
      refreshTimer.current = setInterval(() => {
        run()
      }, 10000);

    }, [filteredResults]);


    useEffect(() => {
      setFilteredResults(Object.entries(results).reduce((p, [key, c]) => {
        console.log(c.type);
        p = {
          ...p          
        }
        if (filters.includes(c.pass)) p[key] = c
        // console.log(p);
        return p
      }, {}))
    }, [filters, results]);

    
    const filterStatus = (event, newFormats) => {
      setFilters(newFormats);
    };


  return !filteredResults ? (<div>ยังไม่มีผู้ทำแบบทดสอบ</div>) : (
        <List  sx={{
        width: '100%',
        bgcolor: 'background.paper',
        position: 'relative',
        overflow: 'auto',
        maxHeight:{ xs: '90vh', sm: '90vh' },
        '& ul': { padding: 0 },
      }} subheader={<li />}>
        <li key='testresults'>
          <ul>
            <ListSubheader>
              <Stack 
              direction="row" 
              justifyContent="flex-start" 
              alignItems="center" spacing={2}               
              divider={<Divider orientation="vertical" 
              flexItem />}>
                <Typography fontSize={15}>{Object.entries(filteredResults).length ? 'ผู้ทำแบบทดสอบล่าสุด' : 'ยังไม่มีผู้ทำแบบทดสอบ'}</Typography>
                <ToggleButtonGroup                
                  value={filters}
                  size='small'
                  onChange={filterStatus}
                  >
              <ToggleButton color="success" value={true}>ผ่าน</ToggleButton>
              <ToggleButton color="error" value={false}>ไม่ผ่าน</ToggleButton>      
            </ToggleButtonGroup>
          </Stack></ListSubheader>
            {Object.entries(filteredResults)
            .map(([_, result], i) => {
          return (
            <React.Fragment key={'resultfragment' + i} >
                <ListItem key={'result' + i} alignItems="flex-start" sx={{ bgcolor: result.pass ? 'lightgreen' : 'tomato'}}>
                <ListItemAvatar>
                {result.pictureUrl ? <Avatar alt={result.displayName} src={result.pictureUrl} /> : <Avatar {...stringAvatar(result.displayName + ' .')} />}
                </ListItemAvatar>
                <ListItemText
                primary={result.displayName}
                secondary={
                    <React.Fragment>
                    <Typography
                        sx={{ display: 'inline' }}
                        component="span"
                        variant="body2"
                        color="text.primary"
                    >
                        {timeLabels[i] || ''}
                    </Typography>
                    {' — ' + result.total + ' คะแนน'}
                    {' : ' + (result.pass ? 'ผ่าน' : 'ไม่ผ่าน')}
                    </React.Fragment>
                }
                />
            </ListItem>
            <Divider variant="inset" />
            </React.Fragment>)
            })}
          </ul>
        </li>




  </List>


  );
}
