import { useState } from "react";
import { Routes, Route, Outlet, Link } from "react-router-dom";
import { CompareMap } from "./pages/CompareMap/CompareMap";
import { MainMap } from "./pages/MainMap/MainMap";

import './App.css';
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css'

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import AdbIcon from '@mui/icons-material/Adb';
import { Card, CardContent, CardMedia, createTheme } from "@mui/material";
import { ThemeProvider } from "@emotion/react";


export default function App() {
  
const pages = [{
  label: 'โหมดเปรียบเทียบ',
  to: "/comparemap"
}];
const settings = ['โปรไฟล์', 'บัญชี', 'ออกจากระบบ'];
const theme = createTheme({
  palette: {
    mode: "dark"
  }
});
const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);


  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };
  return (
    <div>
      

      {/* Routes nest inside one another. Nested route paths build upon
            parent route paths, and nested route elements render inside
            parent route elements. See the note about <Outlet> below. */}
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<MainMap />} />
          <Route path="comparemap" element={<CompareMap />} />

          {/* Using path="*"" means "match anything", so this route
                acts like a catch-all for URLs that we don't have explicit
                routes for. */}
          <Route path="*" element={<NoMatch />} />
        </Route>
      </Routes>
      <ThemeProvider theme={theme}>
      {/* enableColorOnDark */}
        <AppBar  position="static"> 
          <Container maxWidth="xl" >
            <Toolbar disableGutters>
              {/* <AdbIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} /> */}
              {/* <Typography
                variant="h6"
                noWrap
                component="a"
                href="/"
                sx={{
                  mr: 2,
                  display: { xs: 'none', md: 'flex' },
                  fontFamily: 'monospace',
                  fontWeight: 700,
                  letterSpacing: '.3rem',
                  color: 'inherit',
                  textDecoration: 'none',
                }}
              >
                LOGO
              </Typography> */}

              <Card sx={{ overflow:'visible', borderRadius: {xs: 30, md: 40}, display: { xs: 'none', md: 'flex' }, bgcolor:"transparent"}}>
                  <CardMedia
                      component="img"
                      image="nkrafalogo.png"
                      alt="nkrafa logo"
                      sx={{  zIndex:1, width:80, objectFit:'contain'}}
                    />
              </Card>
              <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                <IconButton
                  size="large"
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleOpenNavMenu}
                  color="inherit"
                >
                  <MenuIcon />
                </IconButton>
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorElNav}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                  }}
                  open={Boolean(anchorElNav)}
                  onClose={handleCloseNavMenu}
                  sx={{
                    display: { xs: 'block', md: 'none' },
                  }}
                >
                  {pages.map((page, index) => (
                    <MenuItem key={'label' + index} component={Link} to={page.to}  onClick={handleCloseNavMenu}>
                      <Typography textAlign="center">{page.label}</Typography>
                    </MenuItem>
                  ))}
                </Menu>
              </Box>
              <Card sx={{ overflow:'visible', borderRadius: {xs: 30, md: 40}, display: { xs: 'flex', md: 'none' }, bgcolor:"transparent", mr: 1 }}>
                <CardMedia
                    component="img"
                    image="nkrafalogo.png"
                    alt="nkrafa logo"
                    sx={{  zIndex:2, width:{xs: 60, md: 80},   objectFit:'contain'}}
                  />
            </Card>
            {/* <Typography variant={{ xs: 'caption', md: 'h6' }} component="div" sx={{ flexGrow: 1, bgcolor:{ xs: 'transparent', md: 'black' } }}>
            ระบบข้อมูลภูมิสารสนเทศของ รร.นนก. ณ ที่ตั้ง อ.มวกเหล็ก จว.สระบุรี
            </Typography> */}
            <Box sx={{ m: {xs: 0, md:2}, p: {xs: 0, md:1}, textAlign: 'center',   borderRadius: '20px', typography:{xs: 'caption', md: 'h6', lg: 'h5'}, color:'white'}}>ระบบข้อมูลภูมิสารสนเทศของ รร.นนก. ณ ที่ตั้ง อ.มวกเหล็ก จว.สระบุรี</Box>
            {/* bgcolor:{ xs: 'transparent', sm: 'black' },  */}

            {/* <AdbIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} /> */}
              {/* <Typography
                variant="h5"
                noWrap
                component="a"
                href=""
                sx={{
                  mr: 2,
                  display: { xs: 'flex', md: 'none' },
                  flexGrow: 1,
                  fontFamily: 'monospace',
                  fontWeight: 700,
                  letterSpacing: '.3rem',
                  color: 'inherit',
                  textDecoration: 'none',
                }}
              >
                LOGO
              </Typography> */}
              <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                {pages.map((page, index) => (
                  <Button
                    key={'label' + index}
                    component={Link} to={page.to}  
                    onClick={handleCloseNavMenu}
                    sx={{ my: 2, color: 'white', display: 'block' }}
                  >
                    {page.label}
                  </Button>
                ))}
              </Box>

              <Box sx={{ flexGrow: 0 }}>
                <Tooltip title="Open settings">
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <Avatar alt="ผู้ใช้" src="/static/images/avatar/2.jpg" />
                  </IconButton>
                </Tooltip>
                <Menu
                  sx={{ mt: '45px' }}
                  id="menu-appbar"
                  anchorEl={anchorElUser}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                >
                  {settings.map((setting) => (
                    <MenuItem key={setting} onClick={handleCloseUserMenu}>
                      <Typography textAlign="center">{setting}</Typography>
                    </MenuItem>
                  ))}
                </Menu>
              </Box>
            </Toolbar>
          </Container>
        </AppBar>
  {/* 
        <Outlet /> */}
        
      </ThemeProvider>
    
    </div>
  );
}

// You can think of these components as "pages"
// in your app.

function Layout() {
  return (
    <div>
      {/* A "layout route" is a good place to put markup you want to
          share across all the pages on your site, like navigation. */}
      


      {/* An <Outlet> renders whatever child route is currently active,
          so you can think about this <Outlet> as a placeholder for
          the child routes we defined above. */}
      <Outlet />
    </div>
  );
}


function Home() {
  return (
    <div>
      <h2>Home</h2>
    </div>
  );
}


function NoMatch() {
  return (
    <div>
      <h2>Nothing to see here!</h2>
      <p>
        <Link to="/">Go to the home page</Link>
      </p>
    </div>
  );
}