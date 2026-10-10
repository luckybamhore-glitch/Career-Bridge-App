import jwt from "jsonwebtoken"

 
function socketAuthMiddleware(socket , next) {

    const token = socket.handshake.auth?.token 
    if(!token){
        return next(new Error("Auth Token Missing")
        )
    }
    
    try {
        const decoded = jwt.verify(token , process.env.JWT_SECRET)  
        socket.userID = decoded.id ,
        socket.userType = decoded.type 
        next()
        
    } catch (error) {
        next(new Error("Invalid or expired token"))
    }

}
export default socketAuthMiddleware