const faker = require('faker')

const ENDPOINT_GET_ALL_ROOMS = 'http://localhost:3000/api/rooms'
const ENDPOINT_POST_CREATE_ROOM = 'http://localhost:3000/api/room/new'
const ENDPOINT_GET_ROOM = 'http://localhost:3000/api/room/'
const ENDPOINT_POST_LOGOUT = 'http://localhost:3000/api/logout'
const ENDPOINT_PUT_EDIT = 'http://localhost:3000/api/room/'




function getAllRoomsRequest(cy){
    cy.authenticateSession().then((response =>{
        
        cy.request({
            method: "GET",
            url: ENDPOINT_GET_ALL_ROOMS,
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

function createRoomRequest(cy){
    cy.authenticateSession().then((response =>{
        const payload = {
            "features":["balcony"],
            "category":"single",
            "number":"401",
            "floor":"4",
            "available":true,
            "price":"1750",
            "logoutresponse":"OK"}
        
        // post request to create a room
        cy.request({
            method: "POST",
            url: ENDPOINT_POST_CREATE_ROOM,
            headers:{
                'X-User-Auth': JSON.stringify(Cypress.env().loginToken),
                'Content-Type': 'application/json'
            },
            body:payload 
        }).then((response =>{   
           const responseAsString = JSON.stringify(response)
           expect(responseAsString).to.have.string(payload.number,payload.floor) 
        }))
        
        logoutRequest(cy)
              
    }))
}

function createRoomRequestAndEdit(cy){
    cy.authenticateSession().then((response =>{
    const payload = {
        "features":["ensuite"],
        "category":"double",
        "number":"305",
        "floor":"3",
        "available":true,
        "price":"2500",
               }
    const payloadEdit = {
        "features":["ensuite"],
        "category":"double",
        "number":"601",
        "floor":"3",
        "available":true,
        "price":"2500",
       
    }
    
    // post request to create a room
    cy.request({
        method: "POST",
        url: ENDPOINT_POST_CREATE_ROOM,
        headers:{
            'X-User-Auth': JSON.stringify(Cypress.env().loginToken),
            'Content-Type': 'application/json'
        },
        body:payload 
    }).then((response =>{    
       const responseAsString = JSON.stringify(response)
       expect(responseAsString).to.have.string(payload.number,payload.floor) 

    }))
    
    cy.request({
        method: "GET",
        url: ENDPOINT_GET_ALL_ROOMS,
        headers:{
            'X-User-Auth': JSON.stringify(Cypress.env().loginToken),
            'Content-Type': 'application/json'
        },
    }).then((response =>{   
                   
       let lastChild = response.body[response.body.length -1].id
       
    // change roomnumber
    cy.request({
        method: "PUT",
        url: ENDPOINT_PUT_EDIT+lastChild,
        headers:{
            'X-User-Auth': JSON.stringify(Cypress.env().loginToken),
            'Content-Type': 'application/json'
        },
        body:{
            "features":["ensuite"],
            "category":"double",
            "number":"601",
            "floor":"3",
            "available":true,
            "price":"2500",
            "id":lastChild
           
        }

    }).then((response =>{   
        const responseAsString = JSON.stringify(response)
        expect(responseAsString).to.have.string(payloadEdit.number) 
     }))

        logoutRequest(cy)

    }))

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
    

function deleteRequestRoom(cy){
    //delete request
    cy.authenticateSession().then((response =>{  
        cy.request({
            method: "GET",
            url: ENDPOINT_GET_ALL_ROOMS,
            headers:{
                'X-User-Auth': JSON.stringify(Cypress.env().loginToken),
                'Content-Type': 'application/json'
            },
        }).then((response =>{      
                   
           let lastChild = response.body[response.body.length -1].id
               cy.request({
               method: "DELETE",
               url:ENDPOINT_GET_ROOM+lastChild,
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

function createAndDeleteRequestOfRoom(cy){
    // Delete client after it has been created
    cy.authenticateSession().then((response =>{
        const payload = {
            "features":["penthouse"],
            "category":"twin",
            "number":"602",
            "floor":"6",
            "available":true,
            "price":"10500",
            "id":"10"
            
        }
        
        // post request to create a client
        cy.request({
            method: "POST",
            url: ENDPOINT_POST_CREATE_ROOM,
            headers:{
                'X-User-Auth': JSON.stringify(Cypress.env().loginToken),
                'Content-Type': 'application/json'
            },
            body:payload 
        }).then((response =>{          
           const responseAsString = JSON.stringify(response)
           expect(responseAsString).to.have.string(payload.number, payload.floor)
           
        }))

        deleteRequestRoom(cy)
        logoutRequest(cy)
    }))
}

module.exports = {
    createRoomRequest, 
    getAllRoomsRequest,
    deleteRequestRoom,
    createRoomRequestAndEdit,
    createAndDeleteRequestOfRoom,
    logoutRequest
}
