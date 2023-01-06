import React from "react";
import { Link, useNavigate } from "react-router-dom";
import './main.css'
import { useContext } from "react";
import { Context } from "../context/context";
import { useEffect } from "react";

const Login = () =>{
    const navigate = useNavigate()
    const {link, token, setToken,fetchHeaders} = useContext(Context)
    const resHandler = res =>{
        if(res.status === 200 && res.success){
            setToken(res.token);
            alert('iye barakalla!')
            return
        }

        setToken(false)
        alert(res.message);
    }

    const handleSubmit = e =>{
        e.preventDefault();
        const {login, parol} = e.target
        if(login.value.length<3 || parol.value.length<3){
            alert('malumotla kam juda')
        }

        if(login.value.length>=3 || parol.value.length>=3){
            fetch(`${link}/user_login`,{
                method:'POST',
                headers:fetchHeaders,
                body: JSON.stringify({
                    name: login.value,
                    parol: parol.value
                })
            })
            .then(res => res.json())
            .then(data => resHandler(data))
            .catch((err) => alert('xatolik'))
        }

        e.target.reset()
    }

    useEffect(() =>{
        if(token){
            navigate('/')
        }
    }, [token])

     return (
        <div className="login__wrapper">
            <div className="login__content">
                <h2 className="fw-bold">Login</h2>
                <form onSubmit={handleSubmit} className="login__form" >
                    <div>
                        <span className="d-block ms-2" >Name</span>
                        <input  className="form-control mb-3" type="text" name="login" placeholder='name *' required/>
                    </div>

                    <div>
                        <span className="d-block ms-2" >Password</span>
                        <input  className="form-control mb-3" type="text" name="parol" placeholder='password' required/>
                    </div>
                    <button className="btn btn-success w-100 mb-2" type="submit">Login</button>
                </form>

                <div className="row ms-1 me-1 mt-3 d-flex justify-content-between">
                    <Link className="col-5 btn btn-info mb-2" to='/login'>Register</Link>
                    <Link className="col-5 btn btn-primary  mb-2" to='/'>Bosh menyu</Link>
                </div>
            </div>
        </div>
    )
}

export default Login;