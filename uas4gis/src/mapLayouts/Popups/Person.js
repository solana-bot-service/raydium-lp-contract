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
    const { profile } = props
    const theme = useTheme();
    return (
      <Card sx={{ display: 'flex' }} elevation={0} >
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          
        <Paper elevation={12} sx={{ maxWidth: 120, borderRadius: 3 }} >
            <CardMedia
            component="img"
            sx={{ maxHeight : 'auto', borderRadius: 3 }}
            image={profile.IMAGE_URL || "nkrafalogo.png"}
            alt={profile.NAME || "ภาพบุคคล"}
            />
        </Paper>
        <CardContent sx={{ flex: '1 0 auto' }}>
            <Typography component="div" variant="h6">
              {profile.NAME || "-"}
            </Typography>
            <Typography variant="subtitle2" color="text.secondary" component="div">
              ตำแหน่ง {profile.POSITION || "-"}
            </Typography>
            <Typography variant="subtitle2" color="text.secondary" component="div">
              สถานที่ทำงาน {profile.BUILDING_NAME || "-"}
            </Typography>
            <Typography variant="subtitle2" color="text.iesecondary" component="div">
              อีเมล์: {profile.EMAIL || "-"}
            </Typography> 
          </CardContent>
        </Box>
      </Card>
    );
  }
  