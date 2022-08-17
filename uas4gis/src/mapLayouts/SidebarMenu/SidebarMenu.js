import './SidebarMenu.css'

export const SidebarMenu = ({closeNav}) => {
    return(<div id="mySidebar" className="sidebarmenu">
    <a href="javascript:void(0)" className="closebtn" onClick={closeNav}>×</a>
    <a href="#">About</a>
    <a href="#">Services</a>
    <a href="#">Clients</a>
    <a href="#">Contact</a>
  </div>
  )
}