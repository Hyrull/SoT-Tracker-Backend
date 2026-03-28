import crypto from 'crypto'

if (!process.env.RAT_ENCRYPTION_KEY || process.env.RAT_ENCRYPTION_KEY.length !== 32) {
  throw new Error('FATAL: RAT_ENCRYPTION_KEY is missing or invalid in .env. Must be exactly 32 characters.')
}

const algorithm = 'aes-256-gcm'
const key = Buffer.from(process.env.RAT_ENCRYPTION_KEY, 'utf8')
const ivLength = 16

export const encrypt = (text) => {
  if (!text) return null
  try {
    const iv = crypto.randomBytes(ivLength)
    const cipher = crypto.createCipheriv(algorithm, key, iv)
    let encrypted = cipher.update(text)
    encrypted = Buffer.concat([encrypted, cipher.final()])
    const authTag = cipher.getAuthTag()
    // We return "IV:EncryptedData" so we know which IV to use for decryption
    return iv.toString('hex') + ':' + encrypted.toString('hex') + ':' + authTag.toString('hex')
  } catch (error) {
    console.error('Encryption failed:', error)
    return null
  }
}

export const decrypt = (text) => {
  if (!text) return null
  try {
    const textParts = text.split(':')
    const iv = Buffer.from(textParts.shift(), 'hex')
    const authTag = Buffer.from(textParts.pop(), 'hex')
    const encryptedText = Buffer.from(textParts[0], 'hex')
    const decipher = crypto.createDecipheriv(algorithm, key, iv)
    decipher.setAuthTag(authTag)
    let decrypted = decipher.update(encryptedText)
    decrypted = Buffer.concat([decrypted, decipher.final()])
    return decrypted.toString()
  } catch (error) {
    console.error('Decryption failed:', error)
    return null
  }
}