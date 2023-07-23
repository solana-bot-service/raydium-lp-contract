import { createContext, useContext, useEffect, useState } from "react";
import { Routes, Route, Outlet, Link, useLocation, Navigate } from "react-router-dom";
import { CompareMap } from "./pages/CompareMap/CompareMap";
import { MainMap } from "./pages/MainMap/MainMap";
import { useLiff } from 'react-liff';

import './App.css';
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css'

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
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
import { useAuthContext } from "./auth/AuthContext";
import { Login } from "./pages/Login/Login";

export const isLocalhost = window.location.hostname.includes('localhost')
export const RANKS = [
  'พลฯ',         'พลอาสาสมัคร', 'จ.ต.กองฯ',
  'กห.ป.(ญ)',    'กห.ป.(ช)',   'จ.ต.หญิง',
  'จ.ต.',        'จ.ท.หญิง',    'จ.ท.',
  'จ.อ.หญิง',     'จ.อ.',       'พ.อ.ต.หญิง',
  'พ.อ.ต.',      'พ.อ.ท.หญิง',  'พ.อ.ท.',
  'พ.อ.อ.หญิง',   'พ.อ.อ.',     'พ.อ.อ.(พ) หญิง',
  'พ.อ.อ.(พ)',   'กห.ส.(ญ)',   'กห.ส.(ช)',
  'ร.ต.หญิง',     'ร.ต.',       'ร.ท.หญิง',
  'ร.ท.',        'ร.อ.หญิง',    'ร.อ.',
  'น.ต.หญิง',     'น.ต.',       'น.ท.หญิง',
  'น.ท.',        'น.อ.หญิง',    'น.อ.',
  'น.อ.(พ) หญิง', 'น.อ.(พ)',    'พล.อ.ต.หญิง',
  'พล.อ.ต.',     'พล.อ.ท.หญิง', 'พล.อ.ท.',
  'พล.อ.อ.หญิง',  'พล.อ.อ.',    'พล.อ.อ.*หญิง',
  'พล.อ.อ.*'
]
export default function App() {

  const { user } = useAuthContext()

  const location = useLocation()

  const pathName = location.state?.from || '/'

  const [profile, setProfile] = useState({});
  const { error, isLoggedIn, isReady, liff } = useLiff();

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

  const [drawerOpened, setDrawerOpened] = useState(false);
  const toggleDrawer = () => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setDrawerOpened(s => !s)
  };

  const isLandscape = () => window.matchMedia('(orientation:landscape)').matches,
    [orientation, setOrientation] = useState(isLandscape() ? 'landscape' : 'portrait'),

    onWindowResize = () => {
      clearTimeout(window.resizeLag)
      window.resizeLag = setTimeout(() => {
        delete window.resizeLag
        setOrientation(isLandscape() ? 'landscape' : 'portrait')
      }, 200)
    }

  useEffect(() => (
    onWindowResize(),
    window.addEventListener('resize', onWindowResize),
    () => window.removeEventListener('resize', onWindowResize)
  ), [])

  useEffect(() => {
    if (isLocalhost) return setProfile({
      "userId": "U79bd13e9496f7310b2a82e59fa4435da",
      "displayName": "Chaloemphol",
      "statusMessage": "ev’ry moment new",
      "pictureUrl": "https://profile.line-scdn.net/0hUaMaxL0sCk5gGCBiq-10MRBICSRDaVNcGXhNfFUYB34IeB9NHipDL1wfACsIe0lLSHwSeFxPAytsC30ofk72emcoVHlZLksRTHdErA"
  })

    if (!isLoggedIn) return;

    (async () => {
      const profile = await liff.getProfile();
      setProfile(profile);
    })();
  }, [liff, isLoggedIn]);

  const userStateMenus = () => {

    if (!isLocalhost) {

      if (error) return <MenuItem>
      <Typography textAlign="center">Something is wrong.</Typography></MenuItem>;
      if (!isReady) return <MenuItem>
      <Typography textAlign="center">Loading...</Typography></MenuItem>;

      if (!isLoggedIn) {
        return (<MenuItem key={'login'} onClick={liff.login}>
          <Typography textAlign="center">เข้าสู่ระบบ</Typography>
        </MenuItem>

          // <button className="App-button" onClick={liff.login}>
          //   Login
          // </button>
        );
      }

    }
    return ([{
      key: 'profile',
      action: () => setDrawerOpened(true),
      label : 'โปรไฟล์'
    }, {
      key: 'logout',
      action: () => liff.logout,
      label : 'ออกจากระบบ'
    }].map(m => {
      return (<MenuItem key={m.key} onClick={m.action} >
        <Typography textAlign="center">{m.label}</Typography>
      </MenuItem>)
    }));
  };

  return (
    <div>


      {/* Routes nest inside one another. Nested route paths build upon
            parent route paths, and nested route elements render inside
            parent route elements. See the note about <Outlet> below. */}
      <Routes>
          <Route path="/" element={<Layout />}>
          <Route index element={<MainMap isLoggedIn={isLoggedIn} />} />
          <Route path="comparemap" element={<CompareMap orientation={orientation} />} />
          { user ? <Route path='/login' element={<Navigate to={pathName} />} /> : <Route path='/login' element={<Login />} /> }
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
                  {pages
                  .filter(p => {  
                    return p.to.replace("/", "") !== location.pathname.replace("/", "")
                  })
                  .map((page, index) => (
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
                {pages
                .filter(p => {
                  return p.to.replace("/", "") !== location.pathname.replace("/", "")
                })
                .map((page, index) => (
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
                <Tooltip title={profile.displayName || "ผู้ใช้"}>
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <Avatar alt={profile.displayName || "ผู้ใช้"} src={profile.pictureUrl} />
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
                   {userStateMenus()}
                   {/* {settings.map((setting) => (
                    <MenuItem key={setting} onClick={toggleDrawer()}>
                      <Typography textAlign="center">{setting}</Typography>
                    </MenuItem>
                  ))} */}
                </Menu>
              </Box>
            </Toolbar>
          </Container>
        </AppBar>
        <Drawer
            anchor={'bottom'}
            open={drawerOpened}
            onClose={toggleDrawer()}
          >
          <Box
            sx={{ width: 'auto' }}
            role="presentation"
            onClick={toggleDrawer()}
            onKeyDown={toggleDrawer()}>
              {profile ? profile.displayName : 'กรุณาลงชื่อเข้าใช้ก่อน'}

            </Box>
        </Drawer>
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
    <div style={{   position: 'absolute', top: '64px'}}>
      <h2>ไม่พบหน้านี้</h2>
      <p>
        <Link to="/">กลับไปหน้าแรก</Link>
      </p>
    </div>
  );
}