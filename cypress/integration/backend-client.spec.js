import * as clientHelpers from '../helpers/clientHelpers'



describe('Test Suite Client', function(){
   //Clients
   //Tests from Rafaels demo 4
   it('Create a new client', function(){
       clientHelpers.createClientRequest(cy)
    })

   it('Get all clients', function(){
        clientHelpers.getAllClientsRequest(cy)
     })

   it('Create and delete client', function (){
      clientHelpers.createAndDeleteRequestOfClient(cy)
   }) 
   //My testacase
   it('Create client and edit', function(){
      clientHelpers.createClientRequestAndEdit(cy)
   })
   
})
