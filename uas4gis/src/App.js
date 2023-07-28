import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { Routes, Route, Outlet, Link, useLocation, Navigate } from "react-router-dom";
import { CompareMap } from "./pages/CompareMap/CompareMap";
import { MainMap } from "./pages/MainMap/MainMap";
import { useLiff } from 'react-liff';

import axios from "axios";

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
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import AdbIcon from '@mui/icons-material/Adb';
import { Button, Card, CardContent, CardMedia, createTheme, CardActionArea, CardActions, TextField, Grid } from "@mui/material";


import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';



import { ThemeProvider } from "@emotion/react";
import { useAuthContext } from "./auth/AuthContext";
import { Login } from "./pages/Login/Login";
import { RANKS, personprops } from "./config";

export const isLocalhost = window.location.hostname.includes('localhost')

export default function App() {

  const { user } = useAuthContext()

  const location = useLocation()

  const pathName = location.state?.from || '/'

  const [profile, setProfile] = useState({});
  const [editingProfile, setEditingProfile] = useState(false);
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

  const handleProfileEditing = (event, prop) => {
    setProfile( p => ({...p, [prop] : event.target.value}))

  }


  const handleSubmit = (event) => {
    event.preventDefault();

    if (profile) {

      if (profile.id) {

        // PUT

        axios.put(`http://localhost:8888/api/user/${profile.id}/edit`, profile).then(function(response){
            console.log(response.data);
            setEditingProfile(false)
          });

      } else {

        //  INSERT

        axios.post('http://localhost:8888/api/user/save', profile).then(function (response) {
          console.log(response.data);
          if (response.data && response.data.id) {
            setProfile(p => ({ ...p, id: response.data.id }))
          }
          setEditingProfile(false)
        });
      }

}
    
}
  

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

  // useEffect(() => {

  //   console.log('profile', profile);

  // }, [profile])

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
      action: () => {
        setAnchorElUser(null)
        setDrawerOpened(true) },
      label : 'โปรไฟล์'
    }, {
      key: 'unit',
      action: () => { setAnchorElUser(null) },
      label : 'หน่วย'
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

  const profiledrawer = useMemo(() => {

    const { rank, name, surname }  = personprops

    if (!editingProfile) return (
      <Drawer
          anchor={'right'}
          open={drawerOpened}
          onClose={toggleDrawer()}
        >
        <Box
          sx={{ width: 'auto' }}
          role="presentation"
          // onClick={toggleDrawer()}
          onKeyDown={toggleDrawer()}>
            {/* {profile ? profile.displayName : 'กรุณาลงชื่อเข้าใช้ก่อน'} */}


            <Card sx={{ maxWidth: 345 }}>
            <CardActionArea>
              <CardMedia
                component="img"
                height="80%"
                image={profile.pictureUrl}
                alt={profile.displayName}
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  {profile.displayName}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {profile.statusMessage}
                </Typography>
                <Box sx={{ flexGrow: 1 }}>
                <Grid container spacing={1}>
                {Object.entries(personprops)
                .filter(([p, _]) => personprops[p].required)
                .map(([key, prop]) => {
                  return (<Grid item xs={12}>
                    <Typography variant="body2" color="text.secondary">
                      {profile[key] || "-"}
                    </Typography>
                  </Grid>)
                  })}
                  </Grid>
                </Box>
              </CardContent>
            </CardActionArea>
            <CardActions>
              <Button size="small" color="primary" onClick={() => setEditingProfile(true)}>
                แก้ไขโปรไฟล์
              </Button>
            </CardActions>
          </Card>
          </Box>
      </Drawer>)

      return (
        <Drawer
            anchor={'right'}
            open={drawerOpened}
            onClose={toggleDrawer()}
          >
          <Box
            sx={{ width: 'auto' }}
            role="presentation"
            // onClick={toggleDrawer()}
            // onKeyDown={toggleDrawer()}
            >
              {/* {profile ? profile.displayName : 'กรุณาลงชื่อเข้าใช้ก่อน'} */}


              <Card sx={{ maxWidth: 345 }}>
              <CardActionArea>
                <CardMedia
                  component="img"
                  height="80%"
                  image={profile.pictureUrl}
                  alt={profile.displayName}
                />
                <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                {profile.displayName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {profile.statusMessage}
                  </Typography>
                <Box sx={{ flexGrow: 1 }}>
                <Grid container spacing={1}>
                  {Object.entries(personprops)
                .filter(([p, _ ]) => personprops[p].required)
                .map(([key, prop]) => {
                  switch (prop.type) {
                    case 'select':
                      return (<Grid item xs={12}>                      
                      <FormControl key={key} sx={{ minWidth: 120 }} >
                        <InputLabel id={`${key}-select-label`}>{prop.label}</InputLabel>
                        <Select
                          labelId={`${key}-select-label`}
                          id={`${key}-select`}
                          value={(profile && profile[key]) || ''}
                          label={prop.label}
                          onChange={event => handleProfileEditing(event, key)}
                        >
                          {prop.options.map(r => (<MenuItem key={r.order || r} value={r.name || r}>{r.name || r}</MenuItem>))}
                        </Select>
                      </FormControl>
                      </Grid>)                      
                      
                  
                    default:
                      return (<Grid item xs={12}>
                        <TextField key={key} id={key} label={prop.label} variant="outlined" value={(profile && profile[key]) || ''}
                      onChange={event => handleProfileEditing(event, key)}
                        />
                      </Grid>)
                    
                  }
                })}

                </Grid>
                </Box>
                </CardContent>
              </CardActionArea>
              <CardActions>
                <Button size="small" color="primary" onClick={handleSubmit}>
                  บันทึก
                </Button>
                {/* <Button size="small" color="error" onClick={() => setEditingProfile(false)}>
                  ยกเลิก
                </Button> */}
              </CardActions>
            </Card>
            </Box>
        </Drawer>)

  }, [drawerOpened, editingProfile, profile])

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
        {profiledrawer}
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