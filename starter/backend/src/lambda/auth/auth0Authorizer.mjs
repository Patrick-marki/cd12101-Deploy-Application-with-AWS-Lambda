import pkg from 'jsonwebtoken';
const { verify, decode } = pkg;
import axios from 'axios';

export const handler = async (event) => {
  console.log('Authorizing a user', event.authorizationToken)
  try {
    const jwtToken = await verifyToken(event.authorizationToken)
    console.log('User was authorized', jwtToken)

    return {
      principalId: jwtToken.sub,
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Allow',
            Resource: '*'
          }
        ]
      }
    }
  } catch (e) {
    console.error('User not authorized', { error: e.message })

    return {
      principalId: 'user',
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Deny',
            Resource: '*'
          }
        ]
      }
    }
  }
}

async function verifyToken(authHeader) {
  const token = getToken(authHeader)
  const jwksUrl = `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`

  const response = await axios.get(jwksUrl)
  const keys = response.data.keys
  const signingKeys = keys.find(key => key.use === 'sig' && key.kty === 'RSA' && key.kid && key.x5c && key.x5c.length)

  if (!signingKeys) {
    throw new Error('No signing keys found')
  }

  const publicKey = `-----BEGIN CERTIFICATE-----\n${signingKeys.x5c[0]}\n-----END CERTIFICATE-----`

  return verify(token, publicKey, { algorithms: ['RS256'] })
}

function getToken(authHeader) {
  if (!authHeader) throw new Error('No authentication header')

  if (!authHeader.toLowerCase().startsWith('bearer '))
    throw new Error('Invalid authentication header')

  const split = authHeader.split(' ')
  const token = split[1]

  return token
}