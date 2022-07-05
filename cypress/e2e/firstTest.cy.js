/// <reference types="cypress" />

describe("Test with backend", () =>{

    beforeEach("login to the App", ()=>{
        // cy.server() // to create the cypress server
        // to provide the mocked response to a certain API or stubbing
        // cy.route('GET','**/tags', 'fixture:tags.json') // route() for giving method, end point & file location
        cy.intercept({method:'GET', path: 'tags'}, {fixture: 'tags.json'}) // updated method intercept(), route(), server() are deprecated no need to use them, just use intercept()
        cy.loginToApplication()
    

    })

    // it("should log in", ()=>{
    //     cy.log("You are logged in sucessfully!") //log() use to show message in logs
    // })
    
    it("Verify correct request and response", ()=>{  // to it.skip() this test
        
        // striked because they will be deprecated in future but working for now
        // cy.server() // to create the cypress server
        // cy.route('POST', '**/articles').as('postArticles') // route() for giving method, end point & as() for alias 
        cy.intercept('POST', '**/articles').as('postArticles')

        
        cy.contains('New Article').click()
        cy.get('[formcontrolname="title"]').type('This is title')
        cy.get('[formcontrolname="description"]').type('this is description')
        cy.get('[formcontrolname="body"]').type('this is a body of the Article')
        // cy.get('[placeholder="Enter tags"]').type('artcl_003')
        cy.get('button').contains('Publish Article').click({force:true})

        cy.wait('@postArticles') // @ used with alias to wait for the request
        cy.get('@postArticles').then(xhr => {
            console.log(xhr)  // to see the request in console log
            expect(xhr.response.statusCode).to.equal(200) // Assertions
            expect(xhr.request.body.article.body).to.equal('this is a body of the Article')
            expect(xhr.response.body.article.description).to.equal('this is description')

        })
    })

    it("Intercepting and modifying the request and response", ()=>{  // to it.skip() this test
        
        // striked because they will be deprecated in future but working for now
        // cy.server() // to create the cypress server
        // cy.route('POST', '**/articles').as('postArticles') // route() for giving method, end point & as() for alias 
        
        // cy.intercept('POST', '**/articles', (req) =>{
        //     req.body.article.description = "This is description 2" // to modify the request
        // }).as('postArticles')

        cy.intercept('POST', '**/articles', (req) =>{
            req.reply(res =>{
               expect(res.body.article.description).to.equal('This is description')
               res.body.article.description = "This is description 2"
            })
        }).as('postArticles')

        
        cy.contains('New Article').click()
        cy.get('[formcontrolname="title"]').type('446Deweerrs')
        cy.get('[formcontrolname="description"]').type('This is description')
        cy.get('[formcontrolname="body"]').type('This is a body of the Article')
        // cy.get('[placeholder="Enter tags"]').type('artcl_003')
        cy.contains('Publish Article').click()

        cy.wait('@postArticles') // @ used with alias to wait for the request
        cy.get('@postArticles').then(fetch => {
            // console.log(JSON.parse(JSON.stringify(xhr.response)))  // to see the request in console log
             console.log(fetch.response)
            expect(fetch.response.statusCode).to.equal(307) // Assertions
            expect(fetch.response.body.article.body).to.equal('This is a body of the Article')
            // console.log(xhr.request.body.article.description)
            expect(fetch.response.body.article.description).to.equal('This is description 2')

        })
    })

    it("should gave tags with routing object", () =>{ //it.only() to run only this test
        cy.get('.tag-list')
        .should('contain', 'cypress')
        .and('contain', 'automation')
        .and('contain', 'testing')
    })

  

    it("should gave tags with routing object", () =>{ //it.only() to run only this test
        cy.get('.tag-list')
        .should('contain', 'cypress')
        .and('contain', 'automation')
        .and('contain', 'testing')
    })

    it('Verify the global feed likes count', () =>{
        // Feed tab GET Request fixture call URL without json file small Response directly passing as param
        // cy.route('GET', '**/articles/feed*', '{"articles":[],"articlesCount":0}') 
        cy.intercept('GET', '**/articles/feed*', {"articles":[],"articlesCount":0}) 
        // Global Feeb tab GET request fixture call URL through json file from fixtures json
        // cy.route('GET', '**/articles*', 'fixture:articles.json') 
        cy.intercept('GET', '**/articles*', {fixture: 'articles.json'}) 

        // Verify the Global Feed tab fixture articles favorite count
        cy.contains('Global Feed').click() 
        cy.get('app-article-list button').then( listOfButtons => {
            expect(listOfButtons[0]).to.contain(1)
            expect(listOfButtons[1]).to.contain(5)
        })
        
        // fixture() method to read the fixture files
        cy.fixture('articles').then(file =>{
            const articlelink = file.articles[1].slug // arcticle name/link from the fixture mocked responsed json file
            // cy.route('POST', '**/articles/'+articlelink+'/favorite', file) // concatenate the POST method request URL w.r.t to our fixture file
            cy.intercept('POST', '**/articles/'+articlelink+'/favorite', file)
        })
        cy.get('app-article-list button')
        .eq(1) // for second article which on 1 index
        .click()
        .should('contain', '4') //assertion fav. icon after click on fav. icon
    })


    it("To delete a new article in global feed", ()=>{

       const bodyRequest = {
        "article":{
        "tagList": [],
        "title": "Request from APIs",
        "description": "API testing is easy",
        "body": "Angular is cool"
        }
      }
// 1 Call login API
    //   cy.request('POST', Cypress.env('apiUrl')+'/api/users/login', UserCredentials)
    //   .its('body').then(body =>{
    //       const token = body.user.token

    cy.get('@token').then(token =>{   // token getting from commands.js
// 2 get token from login API & then call articles API with authorization
          cy.request({
              url: Cypress.env('apiUrl') + '/api/articles/',  //cocatenate the apiUrl from env variable
              headers: { 'Authorization': 'Token '+token},   // "Token" text concatenation with token value from variable
              method: 'POST',
              body: bodyRequest
           }).then( response =>{
              expect(response.status).to.equal(200) // Assertion for 200 response match
          })
// UI actions
          cy.wait(500)
          cy.contains(' Title1656956844385 ').click()
          cy.get('.article-preview').first().click()
          cy.get('.article-actions').contains(' Delete Article ').click()

// get Articles objects listing after deletion of first & assertion
          cy.wait(500)
          cy.request({
              url: Cypress.env('apiUrl') + '/api/articles?limit=10&offset=0',
              headers: { 'Authorization': 'Token '+token},
              method: 'GET',
          }).its('body').then( body => {
            //   console.log(body)
              expect(body.articles[0].title).not.to.equal('Request from APIs')

          })


      })


    })
})