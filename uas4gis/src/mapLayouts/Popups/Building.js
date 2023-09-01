import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';


export default function BuildingCard(props) {
    const { building } = props

    console.log('building', building);

    return (
      <Card sx={{ display: 'flex' }} elevation={0} >
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          
        <CardContent sx={{ flex: '1 0 auto' }}>
            <Typography component="div" variant="h6">
              อาคาร {building.NAME}
            </Typography>
            {/* <Typography variant="subtitle2" color="text.secondary" component="div">
              ผู้ปฏิบัติงานในอาคาร
            </Typography> */}
          </CardContent>
        </Box>
      </Card>
    );
  }
  