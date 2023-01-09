import React, { useContext } from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../context/context";
import './style.css'

const AdminPage = () => {
    const {link,fetchHeaders, setToken, token} = useContext(Context);
  const [data, setData] = useState({fetched: false,error: false,data: {}});
  const [data2, setData2] = useState({fetched: false,error: false,data: {}});
  const navigate = useNavigate();
  const [edit, setEdit] =useState({display:false, id:false});
  const [edit2, setEdit2] =useState({display:false, id:false});

  useEffect(() => {
    fetch(`${link}/users`,{
      headers:fetchHeaders
    })
      .then((res) => res.json())
      .then(result => {
        if(result.status === 200 && result.success){
          data.fetched = true
          data.error = false
          data.data = result.data
          setData({...data})
          return
        }
        if(result.status === 401 || result.status===498){
          setToken(false);
            alert(result.message);
            return
        }
      })
      .catch(() => alert('xatolik birozdan keyin urinib ko`ring'));
      
      fetch(`${link}/category`,{
        headers:fetchHeaders
      })
        .then((res) => res.json())
        .then((data) =>
          setData2(
            data.status === 200
              ? { fetched: true, data: data.data }
              : { error: true, fetched: false }
          )
        )
        .catch(() => setData2({ error: true, fetched: false }));

  }, []);

  useEffect(() =>{
    if(!token){
        navigate('/')
    }
  },[])

  const openContent = index => {
    const nestedItem = document.querySelector(`.user__nested__item${index}`);
    nestedItem.classList.toggle('show')
  }

  const EditUser = (id, index) =>{
    const name = document.querySelector(`.user__name${id}`).value
    const parol = document.querySelector(`.user__parol${id}`).value
    const email = document.querySelector(`.user__email${id}`).value
    fetch(`${link}/users/${id}`,{
      headers:fetchHeaders,
      method:'PUT',
      body: JSON.stringify({name, parol, email})
    })
      .then((res) => res.json())
      .then(result => {
        if(result.status === 200 && result.success){
          data.fetched = true
          data.error = false
          data.data[index] = result.data
          setData({...data})
          setEdit({display:false, id: false})
          alert(result.message);
          return
        }
        if(result.status === 401 || result.status===498){
          setToken(false);
            alert(result.message);
            return
        }
        alert(result.message)
      })
      .catch(() => alert('xatolik birozdan keyin urinib ko`ring'));
  }

  const DeleteUser = id =>{
    fetch(`${link}/users/${id}`,{
      headers:fetchHeaders,
      method:'DELETE'
    })
      .then((res) => res.json())
      .then(result => {
        if(result.status === 200 && result.success){
          data.fetched = true
          data.error = false
          data.data = data.data.filter(a => a._id!==id)
            setData({...data});
            alert(result.message);
            return
        }
        if(result.status === 401 || result.status===498){
          setToken(false);
            alert(result.message);
            return
        }
        alert(result.message)
      })
      .catch(() => alert('xatolik birozdan keyin urinib ko`ring'));
  }
  const EditCourse = (id, index, courseIndex) =>{
    const name = document.querySelector(`.course__name${id}`).value
    const about = document.querySelector(`.course__about${id}`).value
    const pic = document.querySelector(`.course__pic${id}`).value
    const category_id = document.querySelector(`.category__id${id}`).value
    fetch(`${link}/courses/${id}`,{
      headers:fetchHeaders,
      method:'PUT',
      body: JSON.stringify({name, about, pic,category_id})
    })
      .then((res) => res.json())
      .then(result => {
        if(result.status === 200 && result.success){
          data.fetched = true
          data.error = false
          data.data[index].courses[courseIndex] = result.data
          setData({...data})
          setEdit2({display:false, id: false})
          alert(result.message);
          return
        }
        if(result.status === 401 || result.status===498){
          setToken(false);
            alert(result.message);
            return
        }
        alert(result.message)
      })
      .catch(() => alert('xatolik birozdan keyin urinib ko`ring'));
  }

  const DeleteCourse = (index,id) =>{
    fetch(`${link}/courses/${id}`,{
      headers:fetchHeaders,
      method:'DELETE'
    })
      .then((res) => res.json())
      .then(result => {
        console.log(result);
        if(result.status === 200 && result.success){
          data.fetched = true
          data.error = false
          data.data[index].courses = data.data[index].courses.filter(a => a._id!==id);
          
            setData({...data});
            alert(result.message);
            return
        }
        if(result.status === 401 || result.status===498){
          setToken(false);
            alert(result.message);
            return
        }
        alert(result.message)
      })
      .catch(() => alert('xatolik birozdan keyin urinib ko`ring'));
  }

    return(
        <div className="container mt-3">
            <div className="user__item mb-3">
                <h3 className="btn">ism</h3>
                <h3 className="btn">parol</h3>
                <h3 className="btn">email</h3>
            </div>
            {
                data.fetched && data.data && data.data.length > 0 ? (
                    data.data.map((e, index) =>(
                        <React.Fragment key={index}>
                        <div className="w-100 d-flex justify-content-between align-items-center">
                            {
                                edit.display && edit.id === e._id ? (
                                    <div className="test__item">
                                       <div  className="user__item">
                                            <input className={`form-control user__name${e._id}`} defaultValue={e.name}  placeholder='name *' type="text"  required/>
                                            <input className={`form-control user__parol${e._id}`} defaultValue={e.parol} placeholder='parol *' type="text" required/>
                                            <input className={`form-control user__email${e._id}`} defaultValue={e.email} placeholder='email *' type="text" required/>
                                        </div>

                                        <div>
                                            <button onClick={() =>EditUser(e._id, index)} className="btn btn-info me-2"><i className="fa-solid fa-check"></i></button>
                                            <button onClick={() =>setEdit({display:false, id:false})} className="btn btn-danger"><i className="fa-solid fa-xmark"></i></button>
                                        </div>
                                    </div>
                                ):(
                                    <div className="test__item">
                                      <div onClick={() => openContent(e._id)} className='user__item'>
                                            <h3>{e.name}</h3>
                                            <h3>{e.parol}</h3>
                                            <h3>{e.email}</h3>                        
                                        </div>
                                        <div >
                                            <button onClick={() =>setEdit({display:true, id:e._id})} className="btn btn-info me-2"><i className="fa-solid fa-pen-to-square"></i></button>
                                            <button onClick={() =>DeleteUser(e._id)} className="btn btn-danger"><i className="fa-solid fa-trash"></i></button>
                                        </div>
                                    </div>
                                )
                            }
                           
                        </div>
                       <div className={`user__nested__wrapper user__nested__item${e._id}`}>
                       {
                        e.courses.length >0 ?(
                            e.courses.map((item, ind) =>(
                               edit2.display && edit2.id === item._id ? (
                                    <div className="user__nested__container" key={ind}>
                                        <div  className={`user__nested__content`}>
                                            <input className={`form-control course__name${item._id}`} type="text" defaultValue={item.name} placeholder='name *' required/>
                                            <input className={`form-control course__about${item._id}`} type="text" defaultValue={item.about} placeholder='about *' required/>
                                            <select  className={`form-select category__id${item._id}`} >
                                                {
                                                        data2.fetched && data2.data ?(
                                                            data2.data.map((a, index) => (
                                                                <option key={index} value={a._id}>{a.name}</option>
                                                            ))
                                                        ):(
                                                            <></>
                                                        )
                                                }
                                            </select>
                                            <input className={`form-control course__pic${item._id}`} type="text" defaultValue={item.pic} placeholder='pic *' required/>
                                        </div>
                                        <div >
                                                <button onClick={() =>EditCourse(item._id,index, ind)} className="btn btn-info me-2"><i className="fa-solid fa-check"></i></button>
                                                <button onClick={() =>setEdit2({display:false, id:false})} className="btn btn-danger"><i className="fa-solid fa-xmark"></i></button>
                                        </div>
                                    </div>
                               ):(
                                <div className="user__nested__container" key={ind}>
                                    <div  className={`user__nested__content`}>
                                        <h3>{item.name}</h3>
                                        <h3>{item.about}</h3>
                                        <h3>{item.category_id.name}</h3>
                                        <img width='40' height='auto' src={item.pic} onError={({ currentTarget }) => {currentTarget.onerror = null; currentTarget.src="https://www.dingwallmedicalgroup.co.uk/website/S55376/files/Photo%20Unavailable.jpg"}} alt={item.name} />
                                    </div>
                                    <div >
                                            <button onClick={() =>setEdit2({display:true, id:item._id})} className="btn btn-info me-2"><i className="fa-solid fa-pen-to-square"></i></button>
                                            <button onClick={() =>DeleteCourse(index,item._id)} className="btn btn-danger"><i className="fa-solid fa-trash"></i></button>
                                    </div>
                                </div>
                               )
                            ))
                        ):(
                           <React.Fragment>
                            <div className={`user__nested__content`}>kurslar yo'q</div>
                            <hr />
                           </React.Fragment>
                        )
                       }
                       </div>
                        </React.Fragment>
                    ))
                ):(
                    <></>
                )
            }
        </div>
    )
}

export default AdminPage;