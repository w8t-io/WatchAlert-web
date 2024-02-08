const { spawn } = require('child_process')

const argv = process.argv.slice(2)
const port = argv[0] || '3000'
const backendIP = argv[1] || 'your-default-backend-ip'

const child = spawn('yarn', ['start'], {
  env: {
    ...process.env,
    REACT_APP_BACKEND_IP: backendIP,
    PORT: port
  },
  stdio: 'inherit'
})

child.on('close', (code) => {
  process.exit(code)
})