import React, { useState} from 'react';

const Context = React.createContext();

const TokenProvider = ({ children }) => {

	const [token ,setToken] = useState(JSON.parse(window.localStorage.getItem("token")) || false)
	    const link = 'https://amaliy-3.onrender.com';
    // const link = 'http://localhost:5000';
    const fetchHeaders = {
        'Content-type':"application/json",
        'token':token
    }
	
	React.useEffect(() => {
        if(token) {
            window.localStorage.setItem("token", JSON.stringify(token)
            )
        }
        else{
            window.localStorage.removeItem("token");
        }
    }, [token])
   
	return (
		<Context.Provider value={{token ,setToken, link, fetchHeaders}}>{children}</Context.Provider>
	);
};

export { Context, TokenProvider };

