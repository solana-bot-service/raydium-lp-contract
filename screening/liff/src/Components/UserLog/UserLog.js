import React, { useEffect, useRef, useState } from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
import BlockIcon from '@mui/icons-material/Block';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import LoginIcon from '@mui/icons-material/Login';
import { toRelative } from '../../App';
import { Divider, IconButton, ToggleButton, ToggleButtonGroup, Tooltip } from '@mui/material';
import { DateTime } from 'luxon';


export default function UserLog(props) {
    let { users } = props


    const statusType = {
      'init' : {
        icon: <FormatListNumberedIcon />,
        color : 'lightblue'
      },
      'follow' : {
        icon: <PersonAddIcon />,
        color : 'lightgreen'
      },
      'unfollow' : {
        icon: <BlockIcon />,
        color: 'orange'
      },
      'weblogin' : {
        icon: <LoginIcon />,
        color : 'pink'
      }
    }

    const [timeLabels, setTimeLabels] = useState([]);    
    const [filters, setFilters] = useState(() => Object.keys(statusType).filter(a => a !== 'weblogin'));
    const [filteredUsers, setFilteredUsers] = useState(users);
    const refreshTimer = useRef(null)

    useEffect(() => {

      // toRelative(Number(activity.date))
      if (refreshTimer.current) clearInterval(refreshTimer.current)

      function run() {
        setTimeLabels(() => Object.entries(filteredUsers)
        .map(([_, activity]) => (toRelative(Number(activity.date)))))
      }
      run()
      refreshTimer.current = setInterval(() => run(), 10000);


    }, [filteredUsers]);

    const filterType = (event, newFormats) => {
      setFilters(newFormats);
    };

    useEffect(() => {
      setFilteredUsers(Object.entries(users).reduce((p, [key, c]) => {
        console.log(c.type);
        p = {
          ...p          
        }
        if (filters.includes(c.type)) p[key] = c
        // console.log(p);
        return p
      }, {}))
    }, [filters, users]);

    if (!filteredUsers) return (<div>รายชื่อผู้ใช้จะปรากฎที่นี่</div>)

  return (<React.Fragment>
    <ToggleButtonGroup
      color='primary'
      value={filters}
      onChange={filterType}
      aria-label="text formatting"
    >
      {Object.entries(statusType).map(([key, status]) => (<ToggleButton value={key}>
        {status.icon}
      </ToggleButton>))}
    </ToggleButtonGroup>
    <List sx={{
        width: { xs: '90vw', sm: '30vh' },
        bgcolor: 'background.paper',
        position: 'relative',
        overflow: 'auto',
        maxHeight:{ xs: '23vh', sm: '90vh' },
        '& ul': { padding: 0 },
      }}>
      {Object.entries(filteredUsers)
      .map(([_, activity], i) => {
        // let activityLabel = user.type === 'follow' ? 'New ' : 'Blocked'

        return (
            <React.Fragment key={'userfragment' + i}>
                <ListItem key={'user' + i} sx={{ bgcolor: statusType[activity.type].color}}
                secondaryAction={
                  <Tooltip title={DateTime.fromMillis(activity.date).toFormat('d LLLyyyy, HH:mm น.')}>
                    <IconButton aria-label={activity.type}>
                    {statusType[activity.type].icon}
                  </IconButton>
                  </Tooltip>
                  
                }
                >
                  <ListItemText primary={activity.displayName} secondary={(activity.testName ? 'เริ่มทำ' + activity.testName : '') + ' ' + (timeLabels[i] || '')}  />            
                  {/* user.date)).toFormat('d LLL yyyy HH:mm') */}
              </ListItem>
              <Divider variant="inset" component="li" />
            </React.Fragment>)
      })}

    </List></React.Fragment>
  );
}
