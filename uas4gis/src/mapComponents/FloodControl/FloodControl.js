import { useMemo, useState } from 'react';
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

    const { simulatingFlood, setSimulatingFlood } = props

  const [value, setValue] = useState(30);

  const handleSliderChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleInputChange = (event) => {
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
      <Button variant="contained" color="info" onClick={() => {
        console.log('====================================');
        console.log('clicked open ui');
        console.log('====================================');
        setSimulatingFlood(true)
        }}>
        จำลองน้ำท่วม
      </Button>      
    </div>);
  return (<div className='floodcontrol'><Box sx={{  bgcolor: 'lightblue' }}>
  
          <Grid container spacing={2} alignItems="center">
              <Grid item>
                  <Typography id="input-slider" gutterBottom>
                      Flood Level
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
                step: 10,
                min: 0,
                max: 100,
                type: 'number',
                'aria-labelledby': 'input-slider',
              }}
            />
          </Grid>
        </Grid>
      </Box></div>)
  }, [handleBlur, setSimulatingFlood, simulatingFlood, value])

  return  ButtonUI

}