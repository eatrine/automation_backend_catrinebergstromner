const faker = require('faker')

const ENDPOINT_GET_CLIENTS = 'http://localhost:3000/api/clients'
const ENDPOINT_POST_CLIENT = 'http://localhost:3000/api/client/new'
const ENDPOINT_GET_CLIENT = 'http://localhost:3000/api/client/'
const ENDPOINT_PUT_EDIT = 'http://localhost:3000/api/client/'
const ENDPOINT_POST_LOGOUT = 'http://localhost:3000/api/logout'

function createRandomClientPayload(){
    const fakeName = faker.name.firstName()
    const fakeEmail = faker.internet.email()
    const fakePhone = faker.phone.phoneNumber()
    
    

    const payload = {
        "name":fakeName,
        "email":fakeEmail,
        "telephone":fakePhone
       
    }

    return payload
}

function getRequestAllClientsWithAssertion(cy,name, email, telephone){
    // GET request to fetch all clients
    cy.request({
        method: "GET",
        url: ENDPOINT_GET_CLIENTS,
        headers:{
            'X-User-Auth': JSON.stringify(Cypress.env().loginToken),
            'Content-Type': 'application/json'
        },
    }).then((response =>{
        const responseAsString = JSON.stringify(response)
        expect(responseAsString).to.have.string(name)
        expect(responseAsString).to.have.string(email)
        expect(responseAsString).to.have.string(telephone)
    }))
}

function getAllClientsRequest(cy){
    cy.authenticateSession().then((response =>{
        cy.request({
            method: "GET",
            url: ENDPOINT_GET_CLIENTS,
            headers:{
                'X-User-Auth': JSON.stringify(Cypress.env().loginToken),
                'Content-Type': 'application/json'
            },
        }).then((response =>{
            const responseAsString = JSON.stringify(response)
            cy.log(responseAsString)
           
        }))

        logoutRequest(cy)
    }))
}

function createClientRequest(cy){
    cy.authenticateSession().then((response =>{
        let fakeClientPayload = createRandomClientPayload() 
        
        // post request to create a client
        cy.request({
            method: "POST",
            url: ENDPOINT_POST_CLIENT,
            headers:{
                'X-User-Auth': JSON.stringify(Cypress.env().loginToken),
                'Content-Type': 'application/json'
            },
            body:fakeClientPayload 
        }).then((response =>{               
           const responseAsString = JSON.stringify(response)
           expect(responseAsString).to.have.string(fakeClientPayload.name)
        }))

        getRequestAllClientsWithAssertion(
            cy,
            fakeClientPayload.name, 
            fakeClientPayload.email, 
            fakeClientPayload.telephone,
            )
        logoutRequest(cy)
    }))
}

function createClientRequestAndEdit(cy){
    cy.authenticateSession().then((response =>{
        let fakeClientPayload = createRandomClientPayload() 
        const payloadEdit = {
           "name":"NotAName"
        }
    
    // post request to create a client
    cy.request({
        method: "POST",
        url: ENDPOINT_POST_CLIENT,
        headers:{
            'X-User-Auth': JSON.stringify(Cypress.env().loginToken),
            'Content-Type': 'application/json'
        },
        body:fakeClientPayload 
    }).then((response =>{    
       const responseAsString = JSON.stringify(response)
       expect(responseAsString).to.have.string(fakeClientPayload.name,fakeClientPayload.email,fakeClientPayload.telephone) 
    }))
    
    cy.request({
        method: "GET",
        url: ENDPOINT_GET_CLIENTS,
        headers:{
            'X-User-Auth': JSON.stringify(Cypress.env().loginToken),
            'Content-Type': 'application/json'
        },
    }).then((response =>{  
                    
       let lastChild = response.body[response.body.length -1].id

    // change name
    cy.request({
        method: "PUT",
        url: ENDPOINT_PUT_EDIT+lastChild,
        headers:{
            'X-User-Auth': JSON.stringify(Cypress.env().loginToken),
            'Content-Type': 'application/json'
        },
        body:payloadEdit
    
    }).then((response =>{   
        
        const responseAsString = JSON.stringify(response)
        expect(responseAsString).to.have.string(payloadEdit.name) 
     }))

     logoutRequest(cy)

    }))

}))
}

function deleteRequestClient(cy){
    //delete request
    cy.authenticateSession().then((response =>{

        cy.request({
            method: "GET",
            url: ENDPOINT_GET_CLIENTS,
            headers:{
                'X-User-Auth': JSON.stringify(Cypress.env().loginToken),
                'Content-Type': 'application/json'
            },
        }).then((response =>{  
                       
           let lastChild = response.body[response.body.length -1].id
           
           cy.request({
               method: "DELETE",
               url:ENDPOINT_GET_CLIENT+lastChild,
               headers:{
                'X-User-Auth': JSON.stringify(Cypress.env().loginToken),
                'Content-Type': 'application/json'
               },

           }).then((response =>{  
            const responseAsString = JSON.stringify(response.body)
            cy.log(responseAsString)
            expect(responseAsString).to.have.string('true')
         }))
         
         logoutRequest(cy)
         
        }))
     }))
    }


function createAndDeleteRequestOfClient(cy){
    // Delete client after it has been created
    cy.authenticateSession().then((response =>{
        let fakeClientPayload = createRandomClientPayload() 
        
        // post request to create a client
        cy.request({
            method: "POST",
            url: ENDPOINT_POST_CLIENT,
            headers:{
                'X-User-Auth': JSON.stringify(Cypress.env().loginToken),
                'Content-Type': 'application/json'
            },
            body:fakeClientPayload 
        }).then((response =>{               
           const responseAsString = JSON.stringify(response)
           expect(responseAsString).to.have.string(fakeClientPayload.name)
        }))

        deleteRequestClient(cy)
        logoutRequest(cy)
    }))
}

function logoutRequest(cy){
    cy.authenticateSession().then((response =>{
    const payload = {
        "logoutResponse":"OK"
    }
    cy.request({
        method: "POST",
        url: ENDPOINT_POST_LOGOUT,
        headers:{
            'X-User-Auth': JSON.stringify(Cypress.env().loginToken),
            'Content-Type': 'application/json'
        },
    }).then((response =>{
        const responseAsString = JSON.stringify(response)
        expect(responseAsString).to.have.string(payload.logoutResponse)

    }))
   
  
}))
}



module.exports = {
    createRandomClientPayload, 
    createClientRequest, 
    getAllClientsRequest,
    deleteRequestClient,
    createAndDeleteRequestOfClient,
    createClientRequestAndEdit
}