const TicketControl = require("../models/ticket-control");

const ticketControl = new TicketControl()

const socketController = (socket)=>{

    socket.emit('ultimo-ticket', ticketControl.ultimo);
    socket.emit('estado-actual', ticketControl.ultimos4);
    socket.emit('tickets-pendientes', ticketControl.tickets.length)


    socket.on('disconnect',()=>{});

    socket.on('siguiente-ticket',(payload,callback)=>{

        socket.emit('tickets-pendientes', ticketControl.tickets.length)
        socket.broadcast.emit('tickets-pendientes', ticketControl.tickets.length)
        
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
        socket.broadcast.emit('estado-actual', ticketControl.ultimos4);
        socket.broadcast.emit('tickets-pendientes', ticketControl.tickets.length)
        socket.emit('tickets-pendientes', ticketControl.tickets.length)

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