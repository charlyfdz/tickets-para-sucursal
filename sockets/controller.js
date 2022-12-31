const TicketControl = require("../models/ticket-control");

const ticketControl = new TicketControl()

const socketController = (socket)=>{

    socket.emit('ultimo-ticket', ticketControl.ultimo);

    socket.on('disconnect',()=>{});

    socket.on('siguiente-ticket',(payload,callback)=>{

        const siguiente = ticketControl.siguiente()
        callback(siguiente);

        //todo notificar que hay un nuevo ticket pendiente de asignar
        
    });

    socket.on('atender-ticket', (escritorio, callback)=>{
        if(!escritorio){
            return callback({
                ok:false,
                msg:'El escritorio es obligatorio'
            })
        }

        const ticket = ticketControl.atenderTicket(escritorio);

        //todo notificar cambio en los ultimos 4

        if(!ticket){
            callback({
                ok:false,
                msg:"ya no hay tickets pendientes"
            })
        }else{
            callback({
                ok:true,
                ticket
            })
        }
    })
}


module.exports = { 
    socketController
}