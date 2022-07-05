import { defineConfig } from 'cypress'



export default defineConfig({
  "viewportHeight": 1080,
  "viewportWidth": 1920,
  "video": false,
  "reporter": "cypress-multi-reporters",
  "reporterOptions": {
    "configFile": "reporter-config.json"
  },
  "env":{
    "username": "artem.bondar16@gmail.com",
    "password": "CypressTest1",
    "apiUrl": "https://conduit.productionready.io",
    "RETRIES": {
    "runMode": 2, // with npm run/npx cypress run headless retries will be 3 attempts
    "openMode": 1  // with npx cypress open retries will be 2 attempts
  }
}
  ,
  e2e: {
    // We've imported your old cypress plugins here.
    // You may want to clean this up later by importing these.
    setupNodeEvents(on, config) {
      return require('./cypress/plugins/index.js')(on, config)
    
      
    },
baseUrl: 'http://localhost:4200',
excludeSpecPattern: '**/examples/*',
  
},


  })

  // supportFile invalid error occurs then to disable supportFile
  // module.exports = defineConfig({
  //   e2e: {
  //     supportFile : false
  //   }
  //  })
  

