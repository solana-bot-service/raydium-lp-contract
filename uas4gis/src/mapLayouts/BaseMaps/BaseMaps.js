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
        <InputLabel id="basemap-label">Basemaps</InputLabel>
        <Select
          labelId="basemap-label"
          id="basemap-select"
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
            }].map(bm => (<MenuItem value={bm.id} >{bm.icon} {bm.name} </MenuItem>))}
        </Select>
      </FormControl>
  </Box>
</>)}