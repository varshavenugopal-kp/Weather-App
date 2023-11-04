import React, { useEffect, useState } from 'react'
import '../Components/Home.css'
import { Cur_Key, api_key } from '../Constants/Constants'
import { useGeolocated } from "react-geolocated";
import axios from 'axios'
import Loader from './Loader';
const imageArray = {
  cloud: '/Images/cloud.png',
  rain: '/Images/rain.png',
  mist: '/Images/mist.png',
  // Add more image URLs for different conditions as needed
};
function Home() {
  const [datas,setData]=useState({});
  const [err,setErr] = useState(false);
  const [location,setLocation]=useState('');
  const [load,setLoad]=useState(false)
  const [curLoc,setcurLoc]=useState(null)
  const [cityName, setCityName] = useState('');

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        setcurLoc({ latitude, longitude });
        // fetchCityName(latitude, longitude);
        fetchWeatherData(latitude, longitude);
      }, (error) => {
        console.error('Error getting location:', error);
      });
    } else {
      console.error('Geolocation is not supported in this browser.');
    }
  }, []);
  console.log("locaaaaaaaations",curLoc);


  async function fetchWeatherData(latitude, longitude) {
    console.log("latt",latitude);
    console.log("long",longitude);
    const curUrl=`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${Cur_Key}`
    try {
     axios.get(curUrl).then((response)=>{
      console.log("heheeee",response);
      const data=response.data
      setData({icon:data?.weather[0]?.icon,temp:(data?.main?.temp-273.15).toFixed(0),name:data?.name,humidity:data?.main?.humidity,wind:(data?.wind?.speed)})
      
    })
    } catch (error) {
      console.error('Error fetching weather data:', error);
    }
  }

  

  
  const url=`http://api.weatherapi.com/v1/current.json?key=${api_key}&q=${location}&aqi=no`
 
  const searchLocation=(event)=>{
     event.preventDefault();
     setLoad(true)
      axios.get(url).then((response)=>{
        console.log(response.data,"hhhh");
       const data=response.data
      setData({icon:data?.current?.condition?.icon,temp:data?.current?.temp_c,name:data?.location?.name,humidity:data?.current?.humidity,wind:data?.current?.wind_kph})
    
          setLoad(false)
      
        // console.log(datas.location,"details");
      }).catch((err)=>{if(err){setErr(true)}});
    // setLocation('')
  }
  console.log(datas?.location?.name,"lllllkllk");    
  return (
    <div>
      <div className='bgImage bg-slate-900  h-screen'>
        <div className='flex justify-center pt-48 h-full w-full'>
          <div className='h-3/4 w-96 rounded-lg bg-white bg-opacity-5 font-medium'>
            <div className='p-10'>
              <form onSubmit={searchLocation} >
              <div className='w-full '>
              <input type='text' 
              className=' appearance-none border bg-transparent text-white outline-none px-5 w-full h-10 rounded-full'
              onClick={()=>setErr(false)}
               value={location} placeholder='Search' onChange={event=>setLocation(event.target.value)} ></input>
              </div>
              </form>
           

        
           
            </div>





            {
              err &&

            <>
           
<div className='flex w-full h-fit p-5 text-white justify-center items-center'>
No result found !
</div>
          
           
            </>
            }
            {!err && <>
           {
            load?
            <Loader/>
            :
            <>
               <div className='px-28'>
              <img src={datas?.icon} className='w-40'></img>
            </div>
            <div className='text-5xl px-32 text-white text-center'>{datas?.temp}°C</div>
            <div className='text-2xl px-36 text-white text-center'>{datas?.name}</div>
            <div className='flex justify-between px-7 pt-10'>
              <div className='flex space-x-3'>
                <img src='/Images/humidity.png'></img>
                <div>
                  <div className=' text-white '>{datas?.humidity}%</div>
                  <div className=' text-white text-sm'>Humidity</div>
                </div>
                
              </div>
              <div className='flex space-x-3'>
                <img src='/Images/wind.png'></img>
                <div>
                  <div className=' text-white '>{datas?.wind} km/hr</div>
                  <div className=' text-white text-sm'>Wind speed</div>
                </div>
              </div>
            </div>
            </>
           }
           
           
            </>}

           
           
          </div>
        </div>
          
      </div>
       
    </div>
  )
}

export default Home
