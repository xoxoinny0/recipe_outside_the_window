import recommend from './recommend.js';

const API_KEY = "4774724ff1b8c46103dc36e9844bb19a";
// https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={API key}
/**
 * OpenWeatherMap 날씨 파라미터 종류(response의 id value)
 * 2xx  - Thunderstorm  뇌우
 * 3xx  - Drizzle       보슬비
 * 5xx  - Rain          비
 * 6xx  - Snow          눈
 * 7xx  - Atmosphere    대기(??)
 * 80x  - Clouds        구름
 * 800  - Clear         맑음
 * 
 * OpenWeatherMap 아이콘 링크
 * http://openweathermap.org/img/wn/${id}@2x.png
 * // id에 각 날씨에 해당하는 Icon 파라미터 입력
 * // response.data.weather의 ico value
 */

/**
 * 위치 정보를 성공적으로 가져왔을 때
 * 
 * @param   {GeolocationPosition}   position    - 주어진 시간에 장치의 위치를 의미하는 객체
 * // 지점은 Coordinates 객체로 표현 --> position.coords
 * // coords 내에 위도(latitude), 경도(longitude) 포함
 */
async function onGeoSuccess(position) {
    // 콜백 파라미터로 전달된 GeolocationPosition 객체 <position>에서
    const lat = position.coords.latitude;   // 위도와
    const lon = position.coords.longitude;  // 경도 추출
    // OpenWeatherMap API에 GET 요청을 위한 url에 현재 장치의 위치 정보 추가
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&exclude=current&appid=${API_KEY}&units=metric&lang=kr`;

    console.log(url);

    // GET을 통해 받아올 데이터 저장할 변수
    let json = null;

    try { // OpenWeaterMap API에 axios GET 요청
        const response = await axios.get(url);
        json = response.data; // 응답 결과에서 JSON 데이터 추출, 저장
    } catch (e) { // 실패 시 처리
        console.error(e);
        alert('요청을 처리하지 못했습니다.');
        return;
    }


    const date = new Date();
    const nowHour = `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;

    // 성공 후 처리
    console.log('Data responsed successfully');
    // 각 데이터 받아오기
    const name = json.name;                     // 지역명
    const weather = json.weather[0].main;       // 날씨
    const weatherIcoId = json.weather[0].icon;  // 날씨 아이콘
    const temp = json.main.temp;                // 기온

    // html의 특정 element에 가져온 날씨 정보 입력
    document.querySelector("#nowWhere").innerText = name;
    document.querySelector("#nowTime").innerText = nowHour;
    document.querySelector("#nowWeather").innerText = weather;
    document.querySelector("#nowWeather + img").setAttribute('src', `http://openweathermap.org/img/wn/${weatherIcoId}@2x.png`);
    document.querySelector("#nowTemp").innerText = `${String(temp)}ºC`;

    recommend(temp);
}
// 위치 정보 불러오기에 실패했을 때
function onGeoError() {
    alert("위치 정보를 식별할 수 없습니다.");
}

/**
 * getCurrentPosition에 사용할 옵션
 * 
 * @params  {long}      maximumAge          - 위치 정보 반환 가능한 최대 시간 (0 ~ Infinity)
 * @params  {long}      timeout             - 위치 정보 요청에 소요 가능한 최대 시간
 * @params  {boolean}   enableHighAccuracy  - 위치정보를 높은 정확도로 수신할 지 여부. true 설정 시 전력소모와 응답시간 증가
 */
const option = {
    enableHighAccuracy: true,   // 높은 정확도
    timeout: 10000,             // 최대 응답 대기시간
    maximumAge: Infinity,       // 위치정보 캐시 저장 시간
};

/**
 * navigator.geolocation의 getCurrentPosition 메서드를 통해 위치 가져오기
 * 
 * navigator            // 사용자 에이전트의 상태와 정보
 * geolocation          // 장치의 위치를 가진 Geolocation 객체
 * getCurrentPosition   // 장치 현재 위치를 가져오는 메서드
 * 
 * @params  {Function}  success     - 위치 정보 탐색 성공 시 수행할 함수
 * @params  {Function}  error       - 위치 정보 탐색 실패 시 수행할 함수
 * @params  {JSON}      option      - getCurrentPotion에 사용할 옵션
 */
navigator.geolocation.getCurrentPosition(onGeoSuccess, onGeoError, option);
console.log(navigator.geolocation);