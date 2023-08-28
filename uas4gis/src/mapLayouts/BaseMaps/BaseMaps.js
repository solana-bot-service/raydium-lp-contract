import { useEffect, useState } from 'react'
import './BaseMaps.css'

import SatelliteIcon from '@mui/icons-material/Satellite';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import ContrastIcon from '@mui/icons-material/Contrast';
import AddRoadIcon from '@mui/icons-material/AddRoad';
import DeckIcon from '@mui/icons-material/Deck';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { Box } from '@mui/material';


export const BaseMaps = (props) => {

  const  { mapstyle, setMapstyle, setRefreshRequired } = props

  const handleChange = (e) => {
    // setAlignment(newAlignment);

    const layerValue = e.target.value;
    // console.log('layerValue', layerValue);
    setMapstyle(layerValue)
    setRefreshRequired(true)
  };
  
    return (<>
  <Box
    className='basemaps-select'
      sx={{ m:1, p:1, maxWidth: 160}}
    >
      <FormControl fullWidth >
        <InputLabel id="demo-simple-select-label">Basemaps</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={mapstyle}
          label="Basemaps"
          size='small'
          onChange={handleChange}
        >
          {
            [
              {
              id: 'satellite-v9',
              name: 'ภาพถ่ายดาวเทียม',
              icon: <SatelliteIcon /> 
            },{
              id: 'streets-v11',
              name: 'Street',
              icon: <AddRoadIcon />
            },{
              id: 'light-v10',
              name: 'Light',
              icon: <WbSunnyIcon />
            },{
              id: 'dark-v10',
              name: 'Dark',
              icon: <ContrastIcon />
            },{
              id: 'outdoors-v11',
              name: 'Outdoors',
              icon: <DeckIcon />
            }].map(bm => (< MenuItem value={bm.id} >{bm.icon} {bm.name} </MenuItem>))}          
        </Select>
      </FormControl>

</Box>


  {/* <ToggleButtonGroup
      value={mapstyle}
      color="primary"
      orientation="vertical"
      exclusive
      onChange={handleChange}
      aria-label="text alignment"
    >
      <ToggleButton value="satellite-v9" aria-label="ภาพถ่ายดาวเทียม" disabled={mapstyle ==="satellite-v9"} >
        <SatelliteIcon />
      </ToggleButton>
      <ToggleButton value="streets-v11" aria-label="Street" disabled={mapstyle ==="streets-v11"}>
        <AddRoadIcon />
      </ToggleButton>
      <ToggleButton value="light-v10" aria-label="Light" disabled={mapstyle ==="light-v10"}>
        <WbSunnyIcon />
      </ToggleButton>
      <ToggleButton value="dark-v10" aria-label="Dark" disabled={mapstyle ==="dark-v10"}>
        <ContrastIcon />
      </ToggleButton>
      <ToggleButton value="outdoors-v11" aria-label="Outdoors" disabled={mapstyle ==="outdoors-v11"}>
        <DeckIcon />
      </ToggleButton>
    </ToggleButtonGroup> */}
    
    </>
  )
}