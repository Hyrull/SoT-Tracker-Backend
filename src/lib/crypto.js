import crypto from 'crypto'

const algorithm = 'aes-256-cbc'
// This must be 32 characters long. Put it in your .env file!
// Example .env: RAT_ENCRYPTION_KEY=12345678901234567890123456789012
const key = Buffer.from(process.env.RAT_ENCRYPTION_KEY || '', 'utf8')
const ivLength = 16

export const encrypt = (text) => {
  if (!text) return null
  try {
    const iv = crypto.randomBytes(ivLength)
    const cipher = crypto.createCipheriv(algorithm, key, iv)
    let encrypted = cipher.update(text)
    encrypted = Buffer.concat([encrypted, cipher.final()])
    // We return "IV:EncryptedData" so we know which IV to use for decryption
    return iv.toString('hex') + ':' + encrypted.toString('hex')
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
    const encryptedText = Buffer.from(textParts.join(':'), 'hex')
    const decipher = crypto.createDecipheriv(algorithm, key, iv)
    let decrypted = decipher.update(encryptedText)
    decrypted = Buffer.concat([decrypted, decipher.final()])
    return decrypted.toString()
  } catch (error) {
    console.error('Decryption failed:', error)
    return null
  }
}