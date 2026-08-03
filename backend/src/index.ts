import { app } from './app.js'
import { config } from './config.js'

const server = app.listen(config.PORT, '127.0.0.1', () => {
  console.info(`ChatBot Design backend listening on http://127.0.0.1:${config.PORT}`)
})

function shutdown(signal: string) {
  console.info(`${signal} received, closing the backend`)
  server.close((error) => {
    process.exit(error ? 1 : 0)
  })
}

process.on('SIGINT', () => shutdown('SIGINT'))
process.on('SIGTERM', () => shutdown('SIGTERM'))
