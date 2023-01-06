import React, {useContext, useEffect} from "react"
import { useState } from "react";
import { Context } from "../context/context"
import './header.css'

const Header = ({setData2}) =>{
    const {token, setToken, link,fetchHeaders} = useContext(Context);
    const logOut = () => setToken(false)
    const [data, setData] = useState({fetched: false,error: false,data: {}});

    useEffect(() => {
       if(token){
        fetch(`${link}/category`,{
          headers:fetchHeaders
        })
          .then((res) => res.json())
          .then(result => {
            if(result.status === 200 && result.success){
                setData({fetched:true, error:false, data: result.data});
                return
            }
            if(result.status === 401 || result.status===498){
              setToken(false);
                alert(result.message);
                return
            }
            alert(result.message)
          })
          .catch(() => setData({ error: true, fetched: false }));    
       }   
  }, []);

  const FilterData = id => {
    fetch(`${link}/courses-by-category/${id}`,{
      headers:fetchHeaders
    })
      .then((res) => res.json())
      .then(result => {
        if(result.status === 200 && result.success){
            setData2({fetched:true, error:false, data: result.data});
            return
        }
        if(result.status === 401 || result.status===498){
          setToken(false);
            alert(result.message);
            return
        }
        alert(result.message)
      })
      .catch(() => setData2({ error: true, fetched: false }));
  }

    return (
        <header  className='header'>
          <div className="header__logo">
           <a className="btn btn-info" href="/">Home</a>
          </div>
          {
            token ? (
              <div className="d-flex">
                {
                  data.fetched && data.data ? (
                    data.data.map((e, index) =>(
                      <button key={index} onClick={() => FilterData(e._id)} className="ms-1 me-1  btn btn-primary">{e.name}</button>
                    ))
                  ):(
                    <></>
                  )
                }

                <a className="btn btn-success ms-1" href="/courses">Kurslar</a>
              </div>
            ):(
              <></>
            )
          }
          <div className="header__nav">
            {
                token ?(
                    <button className='btn btn-primary' onClick={logOut} >Log out</button>
                    ):(
                        <>
                        <a className="btn btn-info header__nav__item" href="/login">Login</a>
                        <a className="btn btn-danger header__nav__item" href="/register">register</a>
                        </>
                    )
            }
          </div>
        </header>
    )
}

export default Header;