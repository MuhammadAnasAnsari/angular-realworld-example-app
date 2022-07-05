// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

//
// Cypress.on('window:before:load', (win) => {
//     Object.defineProperty(win, 'self', {
//       get: () => {
//         return window.top
//       }
//     })
//   })
  
Cypress.Commands.add('loginToApplication', () => {
// Headless Authorization
  const UserCredentials = {
    "user": {
      "email": Cypress.env("username"), 
      "password": Cypress.env("password"),
    }
  }

  cy.request('POST',Cypress.env('apiUrl')+'/api/users/login', UserCredentials)  // concatenate ApiUrl env variable here
  .its('body').then(body =>{
      const token = body.user.token

      cy.wrap(token).as('token')
      cy.visit('/',{  // For headless
        onBeforeLoad (win){
          win.localStorage.setItem('jwtToken', token)
        }
      })
  })

    // cy.visit('/login')
    // cy.get('[placeholder="Email"]').type('artem.bondar16@gmail.com')
    // cy.get('[placeholder="Password"]').type('CypressTest1')
    // cy.get('form').submit()
    
})
