import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import { Paper } from '@mui/material';


export default function PersonCard(props) {
    const { person } = props
    const theme = useTheme();
    return (
      <Card sx={{ display: 'flex' }} elevation={0} >
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          
        <Paper elevation={12} sx={{ maxWidth: 120, borderRadius: 3 }} >
            <CardMedia
            component="img"
            sx={{ maxHeight : 'auto', borderRadius: 3 }}
            image={person.IMAGE_URL || "nkrafalogo.png"}
            alt={person.NAME || "ภาพบุคคล"}
            />
        </Paper>
        <CardContent sx={{ flex: '1 0 auto' }}>
            <Typography component="div" variant="h6">
              {person.RANK}{person.NAME || "-"}
            </Typography>
            <Typography variant="subtitle2" color="text.secondary" component="div">
              ตำแหน่ง: {person.POSITION || "-"}
            </Typography>
            <Typography variant="subtitle2" color="text.secondary" component="div">
              สถานที่ทำงาน: {person.UNIT || "-"}
            </Typography>
            <Typography variant="subtitle2" color="text.secondary" component="div">
              ห้องทำงาน: {person.ROOM || "-"}
            </Typography>
            <Typography variant="subtitle2" color="text.secondary" component="div" sx={{ cursor: 'pointer'}} onClick={() => window.open(`tel:03634${person.TEL.split("-")[1]}`, "_self")}>
              โทร: {person.TEL || "-"}
            </Typography> 
            <Typography variant="subtitle2" color="text.secondary" component="div" sx={{ cursor: 'pointer'}} onClick={() => window.open(`mailto:${person.EMAIL}`, "_self")}>
              อีเมล์: {person.EMAIL || "-"}
            </Typography> 
          </CardContent>
        </Box>
      </Card>
    );
  }
  