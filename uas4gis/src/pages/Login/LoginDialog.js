import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

export default function LoginDialog(props) {
    
    const { showLoginDialog, setShowLoginDialog } = props

    const [open, setOpen] = React.useState(showLoginDialog);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setShowLoginDialog(false)
    };

    React.useEffect(() => {      
        setOpen(showLoginDialog)
    }, [showLoginDialog])
    

  return (
    <div>
      {/* <Button variant="outlined" onClick={handleClickOpen}>
        เปิดหน้า Login
      </Button> */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>เข้าสู่ระบบด้วยอีเมล</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ป้อนอีเมล์และรหัสผ่านที่ตั้งไว้
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="email"
            label="ที่อยู่อีเมล"
            type="email"
            fullWidth
            variant="standard"
          />
        <TextField            
            margin="dense"
            id="password"
            label="รหัสผ่าน"
            type="password"
            fullWidth
            variant="standard"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>ปิด</Button>
          <Button onClick={handleClose}>Log in</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}