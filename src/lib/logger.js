import chalk from 'chalk'

const getTimestamp = () => {
  const now = new Date()
  const timeString = now.toLocaleString('fr-FR', { 
    timeZone: 'Europe/Paris', // Forces correct French time
    hour12: false 
  })
  
  return chalk.gray(`[${timeString}]`)
}

export const logger = {
  info: (...args) => console.log(getTimestamp(), chalk.blue('INFO'), ...args),
  success: (...args) => console.log(getTimestamp(), chalk.green('✔'), ...args),
  error: (...args) => console.error(getTimestamp(), chalk.red.bold('ERROR'), ...args),
  warn: (...args) => console.warn(getTimestamp(), chalk.yellow('⚠'), ...args),
}