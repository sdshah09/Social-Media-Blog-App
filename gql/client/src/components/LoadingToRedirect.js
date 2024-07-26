import React, {useEffect,useState} from 'react'
import { useNavigate } from 'react-router'

const LoadingToRedirect = ({path}) => {
    const [count,setCount] = useState(5)
    let navigate = useNavigate()
    useEffect(()=>{
        const interval = setInterval(()=>{
            setCount((currentCount)=>--currentCount)
        },1000)

        // redirect to login page once count is 0
        count==0 && navigate(path)

        return () => clearInterval(interval)

    },[count])
    
    return(
        <div className='container p-5 text-center'>
            <p>Redirecting you in {count} seconds</p>
        </div>
    ); 
};

export default LoadingToRedirect