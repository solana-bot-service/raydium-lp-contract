import { Checkbox, FormControlLabel, FormGroup } from '@mui/material'
import './FloodControl.css'

export default function FloodControl(props) {
    return (<div id='floodcontrol'>
        
    <FormGroup>
        <FormControlLabel control={<Checkbox defaultChecked />} label="จำลองน้ำท่วม" />
      </FormGroup>
    </div>)
}