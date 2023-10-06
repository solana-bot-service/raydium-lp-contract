import { useMemo, useRef, useState } from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Slider from '@mui/material/Slider';
import MuiInput from '@mui/material/Input';
import WaterIcon from '@mui/icons-material/Water';
import CloseIcon from '@mui/icons-material/Close';
import './FloodControl.css'
import { Button } from '@mui/material';

const Input = styled(MuiInput)`
  width: 42px;
`;

export default function FloodControl(props) {

    const { simulatingFlood, setSimulatingFlood, floodHeight, setFloodHeight } = props

  const [value, setValue] = useState(floodHeight);
  const sliderTimer = useRef()

  const handleSliderChange = (event, newValue) => {
    if (sliderTimer.current) clearTimeout(sliderTimer.current)
    sliderTimer.current = setTimeout(() => {
      setFloodHeight(newValue)  
    }, 50);
    
    setValue(newValue);
  };

  const handleInputChange = (event) => {
    if (sliderTimer.current) clearTimeout(sliderTimer.current)
    sliderTimer.current = setTimeout(() => {
      setFloodHeight(event.target.value === '' ? 0 : Number(event.target.value))
    }, 50);
    setValue(event.target.value === '' ? 0 : Number(event.target.value));
    
  };

  const handleBlur = () => {
    if (value < 0) {
      setValue(0);
    } else if (value > 100) {
      setValue(100);
    }
  };

  const ButtonUI = useMemo(() => {

    if (!simulatingFlood) return (<div className='floodButton'>
      <Button sx={{ ml:1 }} variant="contained" color="info" onClick={() => {
        setSimulatingFlood(true)
        }}>
        จำลองน้ำท่วม
      </Button>      
    </div>);
  return (<div className='floodcontrol'><Box sx={{  bgcolor: 'lightblue' }}>
  
          <Grid container spacing={2} alignItems="center">
              <Grid item>
                  <Typography id="input-slider" gutterBottom>
                      ระดับน้ำ (เมตร)
                  </Typography>
              </Grid>
              <Box flexGrow={1} />
              <Grid item>
                  <CloseIcon onClick={() => {
                        console.log('closing ui');
                        setSimulatingFlood(false)
                    }} />
              </Grid>
          </Grid>
        <Grid container spacing={2} alignItems="center">
          <Grid item>
            <WaterIcon />
          </Grid>
          <Grid item xs>
            <Slider
              value={typeof value === 'number' ? value : 0}
              onChange={handleSliderChange}
              aria-labelledby="input-slider"
            />
          </Grid>
          <Grid item>
            <Input
              value={value}
              size="small"
              onChange={handleInputChange}
              onBlur={handleBlur}
              inputProps={{
                step: 0.1,
                min: 0,
                max: 100,
                type: 'number',
                'aria-labelledby': 'input-slider',
              }}
            />
          </Grid>
        </Grid>
      </Box></div>)
  }, [handleBlur, handleInputChange, handleSliderChange, setSimulatingFlood, simulatingFlood, value])

  return  ButtonUI

}