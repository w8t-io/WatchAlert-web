const curUrl = window.location.hostname
const backendPort = process.env.REACT_APP_BACKEND_PORT
const getPort = function () {
  if (backendPort !== undefined) {
    return backendPort
  }
  return 9001
}
const backendIP = curUrl + ":" + getPort()

export default backendIP