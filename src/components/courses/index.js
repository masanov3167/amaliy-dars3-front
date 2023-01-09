import React, { useState, useContext, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../context/context";
import Header from "../header/header";
import './course.css'

const CoursePanel = () => {
    const navigate = useNavigate();
  const {token,setToken,  link,fetchHeaders} = useContext(Context);
  const [data, setData] = useState({fetched: false,error: false,data: {}});
  const [data2, setData2] = useState({fetched: false,error: false,data: {}});
  const [edit, setEdit] = useState({display:false, id: false})
  const [add, setAdd] = useState(false)
  const val = useRef();

  useEffect(() => {
    fetch(`${link}/my-courses`,{
      headers:fetchHeaders
    })
      .then((res) => res.json())
      .then((data) =>
        setData(
          data.status === 200
            ? { fetched: true, data: data.data }
            : { error: true, fetched: false }
        )
      )
      .catch(() => setData({ error: true, fetched: false }));
      
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

  const DeleteCourse = id =>{
    fetch(`${link}/courses/${id}`,{
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

  const EditCourse = (id, index) =>{
    const name = document.querySelector(`.course_name${index}`).value
    const about = document.querySelector(`.course__about${index}`).value
    const pic = document.querySelector(`.course__pic${index}`).value
    const category_id = document.querySelector(`.category_id${index}`).value
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

  const AddCourse = e =>{
    e.preventDefault();
    const name = document.querySelector(`.course-name`).value
    const about = document.querySelector(`.course-about`).value
    const pic = document.querySelector(`.course-pic`).value
    const category_id = document.querySelector(`.category-id`).value

    fetch(`${link}/courses`,{
      headers:fetchHeaders,
      method:'POST',
      body: JSON.stringify({name, about, pic,category_id})
    })
      .then((res) => res.json())
      .then(result => {
        if(result.status === 200 && result.success){
          data.fetched = true
          data.error = false
          data.data.push(result.data)
          setData({...data})
          setAdd(false)
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

  const useDebounce = (callback, delay) => {
    const latestCallback = useRef();
    const latestTimeout = useRef();
  
    useEffect(() => {
      latestCallback.current = callback;
    }, [callback]);
  
    return () => {
      if (latestTimeout.current) {
        clearTimeout(latestTimeout.current);
      }
  
      latestTimeout.current = setTimeout(() => { latestCallback.current(); }, delay);
    };
  };

  const handleSearch = useDebounce(() =>{
    const searched = val.current.value;

    console.log(searched);
    fetch(`${link}/my-courses_search`,{
      headers:fetchHeaders,
      method: 'POST',
      body: JSON.stringify({title: searched})
    })
      .then((res) => res.json())
      .then((data) =>
      setData(
        data.status === 200
          ? { fetched: true, data: data.data }
          : { error: true, fetched: false }
      )
    )
    .catch(() => setData({ error: true, fetched: false }));
    
    } , 1000);

    useEffect(() =>{
        if(!token){
            navigate('/')
        }
    },[])

  return (
    <div className="kontainer">
        <Header setData2={setData} />

        <div>
          <input ref={val} onKeyUp={handleSearch} className="form-control mb-5" type="text" placeholder="kurs izlash..." />
        </div>

        <div className="mt-2 mb-5 d-flex justify-content-between align-items-center">
            <h2>Kurslar</h2>
            <button onClick={()=> (setAdd(true), setEdit({display:false, id:false}))} className="btn btn-primary">Qo'shish +</button>
        </div>

        {
            add ? (
                <form className="w-50" onSubmit={AddCourse}>
                    <div>
                        <span className="d-block ms-2" >name</span>
                        <input className={`form-control mb-2 course-name`}  type="text" name="name" placeholder='name *' required/>
                    </div>

                    <div>
                        <span className="d-block ms-2" >about</span>
                        <input  className={`form-control mb-2 course-about`}  type="text" name="parol" placeholder='about *' required/>
                    </div>

                    <div>
                        <span className="d-block ms-2" >category</span>
                        <select  className={`form-select category-id`} >
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
                    </div>

                    <div>
                        <span className="d-block ms-2" >pic</span>
                        <input  className={`form-control mb-2 course-pic`}  type="text" name="pic" placeholder='pic' required/>                   
                    </div>
                    <button  className="btn btn-info w-100 mb-2" type="submit">Qo'shish</button>
                    <button onClick={() => setAdd(false)}  className="btn btn-danger w-100 mb-2" type="button">X</button>
                </form>
            ):(
                <></>
            )
        }
            
        <div className="users__list row">
        {
            data.fetched && data.data.length > 0 ? (
                data.data.map((e, index) => (
                  <div key={index} className="col-3 mb-3">
                      {
                        edit.display && edit.id === e._id ? (
                          <div>
                            <div>
                                  <span className="d-block ms-2" >name</span>
                                  <input className={`form-control mb-2 course_name${index}`} defaultValue={e.name} type="text" name="name" placeholder='name *' required/>
                              </div>

                              <div>
                                  <span className="d-block ms-2" >about</span>
                                  <input  className={`form-control mb-2 course__about${index}`} defaultValue={e.about} type="text" name="parol" placeholder='about *' required/>
                              </div>

                              <div>
                                  <span className="d-block ms-2" >category</span>
                                  <select defaultValue={e.category_id._id} className={`form-select category_id${index}`} >
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
                              </div>

                              <div>
                                  <span className="d-block ms-2" >pic</span>
                                  <input  className={`form-control mb-2 course__pic${index}`} defaultValue={e.pic} type="text" name="pic" placeholder='pic' required/>                   
                              </div>
                              
                              <button onClick={() => EditCourse(e._id, index)} className="btn btn-info w-100 mb-2" type="submit">Edit</button>
                          </div>
                        ):(
                          <div className="users__list__item">
                            <img onError={({ currentTarget }) => {currentTarget.onerror = null; currentTarget.src="https://www.dingwallmedicalgroup.co.uk/website/S55376/files/Photo%20Unavailable.jpg"}} src={e.pic} alt={`${e.name}'s img`} />
                            <h4>{e[`name`]}</h4>
                            <h4>{e[`about`]}</h4>
                            <h5>{e.category_id.name}</h5>
                            <button onClick={() => DeleteCourse(e._id)} className="btn btn-danger"><i className="fa-solid fa-trash"></i></button>
                            <button onClick={() => setEdit({display:true, id: e._id})} className="ms-2 btn btn-danger"><i className="fa-solid fa-pen-to-square"></i></button>
                          </div>
                        )
                      }
                  </div>
                ))
            ): (
              <></>
            )
        }
      </div>
      
      </div>
  );
};

export default CoursePanel;
