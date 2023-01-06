import React from "react";
import { Link, useNavigate } from "react-router-dom";
import './main.css'
import { useContext } from "react";
import { Context } from "../context/context";
import { useEffect } from "react";

const Register = () =>{
    const navigate = useNavigate()
    const {link, token, setToken, fetchHeaders} = useContext(Context)
    
    const resHandler = res =>{
        if(res.status === 200 && res.success){
            setToken(res.token);
            alert('success')
            return
        }

        setToken(false)
        alert(res.message)
    }

    const handleSubmit = e =>{
        e.preventDefault();
        const {name, parol, email} = e.target

        if(name.value.length<3 || parol.value.length<3 || email.value.length<3){
            alert('malumotla kam');
            return
        }

        const raw = {
            name: name.value,
            parol: parol.value,
            email: email.value,
        }

            fetch(`${link}/users`,{
                method:'POST',
                headers:fetchHeaders,
                body: JSON.stringify(raw)
            })
            .then(res => res.json())
            .then(data => resHandler(data))
            .catch(() => alert('xatolik'))

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
                <h1 className="fw-bold fs-1">Register</h1>
                <form onSubmit={handleSubmit} className="login__form mt-5" >
                    <div>
                        <h3 className="d-block ms-2" >Username</h3>
                        <input className="form-control mb-4" type="text" name="name" placeholder='name *' required/>
                    </div>

                    <div>
                        <h3 className="d-block ms-2" >password</h3>
                        <input  className="form-control mb-4" type="text" name="parol" placeholder='password' required/>
                    </div>

                    <div>
                        <h3 className="d-block ms-2" >email</h3>
                        <input  className="form-control mb-4" type="text" name="email" placeholder='email' required/>                   
                    </div>

                    <button className="btn btn-success w-100 mb-2" type="submit">register</button>
                </form>

                <div className="row ms-1 me-1 mt-3 d-flex justify-content-between">
                <Link className="col-5 btn btn-info mb-2" to='/login'>login</Link>
                <Link className="col-5 btn btn-primary  mb-2" to='/'>Bosh menyu</Link>
                </div>
            </div>
        </div>
    )
}

export default Register;