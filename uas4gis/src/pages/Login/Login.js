
export function Login(props) {
    let { profile } = props
    return (<>{profile ? profile.displayName : 'กรุณาลงชื่อเข้าใช้ก่อน'}</>)
}