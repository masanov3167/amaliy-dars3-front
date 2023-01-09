import React, { useState, useContext, useEffect, useRef } from "react";
import { Context } from "../context/context";
import Header from "../header/header";
import './homeItem.css'

const Main = () => {
  const {setToken,  link,fetchHeaders} = useContext(Context);
  const [data, setData] = useState({fetched: false,error: false,data: {}});
  const [imgError, setImgError] = useState([])
  const val = useRef();

  useEffect(() => {
    fetch(`${link}/courses`,{
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
      
  }, []);

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
    fetch(`${link}/courses_search`,{
      headers:fetchHeaders,
      method: 'POST',
      body: JSON.stringify({title: searched})
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
    
    } , 1000);

    const DownloadFile = mimeType => {
      const blob = new Blob([JSON.stringify(data.data, null, 2)], {type: mimeType === 'txt' ? "plain/text" : mimeType === 'excel' ? 'application/vnd.ms-excel' : 'application/msword'})
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = `Courses-${+new Date()}.${mimeType === 'txt' ? "txt" : mimeType === 'excel' ? 'xls' : 'doc'}`;
      link.click();
    }

  return (
    <div className="kontainer">
        <Header setData2={setData}  />

        <div>
          <input ref={val} onKeyUp={handleSearch} className="form-control mb-5" type="text" placeholder="kurs izlash..." />
        </div>

        <div className="row mt-5 mb-5">
            <button className="col-1 btn btn-primary ms-2" onClick={() => DownloadFile('txt')}>TXT</button>
            <button className="col-1 btn btn-primary ms-2" onClick={() => DownloadFile('excel')}>Excel</button>
            <button className="col-1 btn btn-primary ms-2" onClick={() => DownloadFile('word')}>Word</button>
        </div>

        <div className="users__list row">
        {
            data.fetched && data.data.length > 0 ? (
                data.data.map((e, index) => (
                  <div key={index} className="col-3 mb-3">
                      <div className="users__list__item">
                            <img onError={() => setImgError([...imgError,e._id])} src={imgError.some(a => a === e._id) ? 'https://www.dingwallmedicalgroup.co.uk/website/S55376/files/Photo%20Unavailable.jpg' : e.pic} alt={`${e.name}'s img`} />
                            <h4>{e[`name`]}</h4>
                            <h4>{e[`about`]}</h4>
                            <h5>{e.category_id.name}</h5>
                          </div>
                      </div>
                ))
            ): data.fetched && data.data.length === 0 ? (
              <div className="loading__wrap">
                <div className="loading__container">
                  <div className="loading__ball"></div>
                  <div className="loading__text">Topilmadi :(</div>
                  
                </div>
              </div>
            ): data.error && data.fetched === false ? (
              <div className="loading__wrap">
                <div className="loading__container">
                  <div className="loading__ball"></div>
                  <div className="loading__text">Xatolik &#9888;</div> 
                </div>
              </div>
            ):(
              <div className="loading__wrap">
                <div className="loading__container">
                  <div className="loading__ball"></div>
                  <div className="loading__text">Yuklanmoqda &#9203;</div>
                </div>
              </div>
            )
        }
      </div>
      
      </div>
  );
};

export default Main;
