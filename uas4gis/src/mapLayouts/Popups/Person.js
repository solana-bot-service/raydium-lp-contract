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


export default function PersonCard(props) {
    const { profile } = props
    const theme = useTheme();
    return (
      <Card sx={{ display: 'flex' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          
        <CardMedia
          component="img"
          sx={{ width: 120, maxHeight : 120 }}
          image={profile.IMAGE_URL || "nkrafalogo.png"}
          alt={profile.NAME || "nkrafa logo"}
        />
        <CardContent sx={{ flex: '1 0 auto' }}>
            <Typography component="div" variant="h5">
              {profile.NAME}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary" component="div">
              สถานที่ทำงาน {profile.BUILDING_NAME}
            </Typography>
          </CardContent>
        </Box>
      </Card>
    );
  }
  