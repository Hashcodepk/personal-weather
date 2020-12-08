const key1 = "vCeuVFGXJUYjs5I6sgwj0VQMPYuItF7m";
const key2 = "D9TDZxBcNY5QZDLcgBl0hse7g4L12AnS";
const key3 = "dcoTRM0Rf4nYIef48qSISx2AeM7cr9Le";
const proxy = "https://cors-anywhere.herokuapp.com/";
const accu_api = `https://dataservice.accuweather.com/currentconditions/v1/260803?apikey=SurGM538ksuF4wAkU1A11mwPGqBXDAWc&details=true`;
let url = 'https://dataservice.accuweather.com';


//Auto Complete and creating a temporary list
const input = document.querySelector('#input');
const list_item = document.querySelector('.list-group');

callEventListeners();

function callEventListeners(){
    input.addEventListener('keyup', showCityList);
}

function showCityList(e){
    let query = e.target.value;
    let endPoint = '/locations/v1/cities/autocomplete';
    if(query === ''){
        document.querySelector('.list-group').innerHTML = '';
    }
    else{
        let requestUrl = `${url}${endPoint}?apikey=${key2}&q=${query}`;
        getLocation(requestUrl).then((data)=>{
            createTemporaryViewList(data);  
        }).catch((err)=>{
            console.log(err.message);
        })
    }
}


const getLocation = async (requestUrl) =>{
    const response = await fetch(requestUrl);
    const data = await response.json();
    return data;
}


function createTemporaryViewList(data){
    let ul = document.querySelector('.list-group');
    let i = 0;
    if(ul.firstChild){
        ul.innerHTML = '';
    }
    if(data.length <= 6){
        i = data.length;
    }
    else{
        i = 6;
    }
    for(let j = 0 ; j < i ; j++){
        let list = document.createElement('li');
        let id = document.createElement('span');
        id.classList.add('hidden-id');
        id.textContent = data[j].Key;
        list.classList.add('list-group-item');
        list.textContent = data[j].LocalizedName;
        list.appendChild(id);


        ul.appendChild(list);
    }

}

list_item.addEventListener('click', getSelectedCityId);


//getting data of selected city

function getSelectedCityId(e){
    if(e.target.classList.contains('list-group-item')){
        let cityId = e.target.firstElementChild.textContent;
        let cityName = e.target.innerText;
        
        fetch(`https://dataservice.accuweather.com/currentconditions/v1/${cityId}?apikey=${key3}&details=true`)
        .then(data => data.json())
        .then(result => updateUiCurrent(cityName, result))
        
        fetch(`https://dataservice.accuweather.com/forecasts/v1/daily/1day/${cityId}?apikey=${key3}&details=true&metric=true`)
        .then(data => data.json())
        .then(result => updateUiForcast(result))

        removeList();
    }
}

function removeList(){
    list_item.innerHTML = '';
    input.value = null;
}

function updateImage(imageResult){
    const numb = Math.floor(Math.random() * 30);
    const i = imageResult.results[numb].urls.regular;
    imgBox.style.backgroundImage = `url('${i}')`;
}

//Updating DOM Current Conditions 
const mainRender = document.querySelector('.main-render');
const status = document.querySelector('.status');
const details = document.querySelector('.details');
const imgBox = document.querySelector('#img-box');


function updateUiCurrent(name, data) {

    fetch(`https://api.unsplash.com/search/photos?query=${name}&per_page=30&client_id=gK52De2Tm_dL5o1IXKa9FROBAJ-LIYqR41xBdlg3X2k`)
            .then(res => res.json())
            .then(imageResult => updateImage(imageResult))
    
    const { 
        Temperature,
        RealFeelTemperature,
        RealFeelTemperatureShade,
        RelativeHumidity,
        Visibility,
        CloudCover,
        UVIndex, 
        UVIndexText,
        DewPoint,
        PrecipitationSummary,
        WindGust,
        Wind,
        Pressure,
        Ceiling,
        TemperatureSummary,
        WeatherText,
        WeatherIcon
     } = data[0]
        
 

    	 // CONVERSIONS
		 let temp = Math.round(Temperature.Metric.Value);
		 let tempfeels = Math.round(RealFeelTemperature.Metric.Value);
		 let tempfeelshade = Math.round(RealFeelTemperatureShade.Metric.Value);
		 let wg = Math.round(WindGust.Speed.Metric.Value);
		 let ws = Math.round(Wind.Speed.Metric.Value);
		 let dp = Math.round(DewPoint.Metric.Value);
         let visibround = Math.round(Visibility.Metric.Value);
         
        
        //HTML.
        mainRender.innerHTML = `
         <h4 class="weather-main__city-heading">
                ${name}
            </h4>
            <div class="today-tonight">
                <h3 class="temp">${temp}&deg;C</h3>
                <p class="real-feel-parent">Real Feel: <span class="real-feel fw-bold">${tempfeels}&deg;C</span></p>
                <p class="real-feel-shade-parent">Real Feel Shade: <span class="real-feel-shade fw-bold">${tempfeelshade}&deg;C</span></p>   
            </div>
     `
        status.innerHTML = `
                <img src="https://www.accuweather.com/images/weathericons/${WeatherIcon}.svg" alt="weather icon" class="img-icon">
                <p class="status-msg">${WeatherText}</p>`

        details.innerHTML = `
                <div class="other-details">
                <div class="pb-3">
                <div class="d-inline p-2 abc">Humidity: <span class="humidity">${RelativeHumidity}</span>%</div>
                <div class="d-inline p-2 abc">Visibility: <span class="visibility">${visibround}</span> Km</div>
                <div class="d-inline p-2 abc">Cloud: <span class="cloud-cover">${CloudCover}</span>%</div>
                </div>
                <div class="pb-3">
                <div class="d-inline p-2 abc ">UV: <span class="uv-index">${UVIndex}</span> <span class="uv-text">${UVIndexText}</span></div>
                <div class="d-inline p-2 abc">Dew Point: <span class="dewpoint">${dp}</span>&deg;</div>
                <div class="d-inline p-2 abc">Precip: <span class="precipitation">${PrecipitationSummary.Precipitation.Metric.Value}</span></div>
                </div>
                <div class="pb-3">
                <div class="d-inline p-2 abc">Wind Gusts: <span class="windgusts">${wg}</span> km/h</div>
                <div class="d-inline p-2 abc">Wind: <span class="windd">${Wind.Direction.Localized}</span> </span> <span class="windspeed">${ws}</span> km/h</div>
                </div>
                <div class="pb-3">
                <div class="d-inline p-2 abc">Pressure: <span class="pressure">${Pressure.Metric.Value}</span> mbar</div>
                <div class="d-inline p-2 abc">Ceiling: <span class="ceiling">${Ceiling.Metric.Value}</span> m</div>
                </div>
                <div class="pb-3">
                <div class="d-blcok pt-2 past-temp mt-5">Minimum Temperature Past 24h:</div>
                <div class="d-blcok"><span class="past24  fw-bold">${TemperatureSummary.Past24HourRange.Minimum.Metric.Value}</span>&deg;</div>
                <div class="d-blcok pt-2 past-temp">Maximum Temperature Past 24h:</div>
                <div class="d-blcok pb-2"><span class="past24Max fw-bold">${TemperatureSummary.Past24HourRange.Maximum.Metric.Value}</span>&deg;</div>
                </div>
            </div>`

      
}

const todayy = document.querySelector('.todayy');
const suntime = document.querySelector('.suntime');
const aq = document.querySelector('.aq');


function updateUiForcast(data) {
    
    function Unix_to_norm(t)
		{
		var dt = new Date(t*1000);
		var hr = dt.getHours();
		var m = "0" + dt.getMinutes();
		var s = "0" + dt.getSeconds();
		return hr+ ':' + m.substr(-2);  
		}

		const sun = Unix_to_norm(data.DailyForecasts[0].Sun.EpochRise);
		const set = Unix_to_norm(data.DailyForecasts[0].Sun.EpochSet);

		let fh = Math.round(data.DailyForecasts[0].Temperature.Maximum.Value);
		let fhf = Math.round(data.DailyForecasts[0].RealFeelTemperature.Maximum.Value);
		let fl = Math.round(data.DailyForecasts[0].Temperature.Minimum.Value);
		let flf = Math.round(data.DailyForecasts[0].RealFeelTemperature.Minimum.Value);

		
		// DOM        

        todayy.innerHTML = `
        <div class="row">
        <div class="col-6 today">Today</div>
        <div class="col-6 tonight">Tonight</div>
        <div class="col-6 t-temp fw-bold">${fh}&deg;C</div>
       


        
        <div class="col-6 fw-bold tn-temp">${fl}&deg;C</div>
        <div class="col-6 t-realfeel">Real Feel: ${fhf}&deg;C</div>
        <div class="col-6 tn-realfeel">Real Feel: ${flf}&deg;C</div>
        <div class="col-6">${data.DailyForecasts[0].Day.ShortPhrase}</div>
        <div class="col-6">${data.DailyForecasts[0].Night.ShortPhrase}</div>
        </div>`

        suntime.innerHTML = `

        <div class="row">
                  <div class="col-6">
                    <div class="col-12 sunrise">Sunrise</div>
                    <div class="col-12 sunrise-time">${sun}</div>
                  </div>
                  <div class="col-6">
                    <div class="col-12 sunset">Sunset</div>
                    <div class="col-12 sunset-time">${set}</div>
                  </div>
              </div>
              <div class="col-12 t-realfeel mt-5">
			<p>Hours of Sun: <span>${data.DailyForecasts[0].HoursOfSun}</span></p>
        </div>`
        

        aq.innerHTML = `
        <div class="text-center pb-3">
                <h3 class="fw-bold aq-heading">Air Quality</h3>
                <div class="d-blcok p-2 fw-bold ab">Forecast:</div>
                <div class="d-blcok pb-3 abcd"><span class="forcast">${data.Headline.Text}</span></div>
                <div class="col-12 t-realfeel mt-2">
            <p>Source: <a href="${data.DailyForecasts[0].Link}"><span>${data.DailyForecasts[0].Sources[0]} ♥️</span></a></p>
            
        </div>
        </div>
        `
}




window.addEventListener('load', (event) => {
    if ('serviceWorker' in navigator) {
        try {
            navigator.serviceWorker.register('sw.js');
        } catch (error) {
            console.log('SW failed', error.message);
		}
    }
    
    defaultCity();
  });

  function defaultCity() {
    let cityId = 261158;
    let cityName = 'Karachi';
    
    fetch(`https://dataservice.accuweather.com/currentconditions/v1/${cityId}?apikey=${key2}&details=true`)
    .then(data => data.json())
    .then(result => updateUiCurrent(cityName, result))
    
    fetch(`https://dataservice.accuweather.com/forecasts/v1/daily/1day/${cityId}?apikey=${key3}&details=true&metric=true`)
    .then(data => data.json())
    .then(result => updateUiForcast(result))

    removeList();
  }
