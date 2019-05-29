
import Keycloak from 'keycloak-js'
const kc = Keycloak({
  url: 'http://localhost:8080/auth',
  realm: 'ghost',
  cors: true,
  clientId: 'saas-rec'
})

export default kc
