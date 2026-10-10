// import { useEffect, useState } from "react"
// import { useSelector } from "react-redux"

// const useAuthStatus = ()=>{

// const {user} = useSelector(state => state.auth)


// const[checkingUser , setCheckingUser] = useState(true)
// const [isAuthenticated , setIsAuthenticated] = useState(false)

// useEffect(()=>{
// setIsAuthenticated(user?true : false)
// setCheckingUser(false)

// } , [user])
//  return{ checkingUser , isAuthenticated}

// }

// export default useAuthStatus

import { useEffect, useState } from "react"
import { useSelector } from "react-redux"

const useAuthStatus = () => {

    const { user } = useSelector(state => state.auth)

    const [checkingUser, setCheckingUser] = useState(true)
    const [isAuthenticated, setIsAuthenticated] = useState(false)

    useEffect(() => {
        setIsAuthenticated(user ? true : false)
        setCheckingUser(false)
    }, [user])

    return { checkingUser, isAuthenticated }
}

export default useAuthStatus