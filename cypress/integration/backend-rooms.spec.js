import * as roomHelpers from '../helpers/roomHelpers'


describe('Test Suite Rooms', function(){

       //Rooms
 it('Create a new room', function(){
    roomHelpers.createRoomRequest(cy)
 })

 it('Create and delete a room', function (){
    roomHelpers.createAndDeleteRequestOfRoom(cy)
 })

 it('Create and edit a room', function (){
    roomHelpers.createRoomRequestAndEdit(cy)
 })

})