import utilHelper from '../helper/UtilHelper.js';

// http://openapi.foodsafetykorea.go.kr/api/keyId/serviceId/dataType/startIdx/endIdx
// http://openapi.foodsafetykorea.go.kr/api/인증키/서비스명/요청파일타입/요청시작위치/요청종료위치
// http://openapi.foodsafetykorea.go.kr/api/인증키/서비스명/요청파일타입/요청시작위치/요청종료위치/변수명=값&변수명=값2

/**
 * @param   {string}    keyId           - 발급된 인증키
 * @param   {string}    serviceId       - 요청 대상 서비스명
 * @param   {string}    dataType        - 요청파일 타입( xml / json )
 * @param   {string}    startIdx        - 요청 시작 위치
 * @param   {string}    endIdx          - 요청 종료 위치
 * @param   {string}    RCP_NM          - 메뉴명
 * @param   {string}    RCP_PARTS_DTLS  - 재료 정보
 * @param   {string}    CHNG_DT         - 변경 일자(YYYYMMDD) // 변경일자 기준 이후 자료만 출력
 */
const API_KEY = "1cf548eb09e043b08c57";
const SERVICE_ID = "COOKRCP01";
const DATA_TYPE = "json";
let startIdx = 0;
let endIdx = 0;

const params = utilHelper.getUrlParams();

// 한 페이지 당 요리 50개 씩 화면에 노출
if (!params.page) { // queryString 파라미터에 page가 없다면 그냥 1~50까지 50개
    startIdx = 1;
    endIdx = 50;
} else {            // 만약 있다면 해당 페이지의 50개 화면에 출력
    document.querySelector('#page').value = params.page;
    startIdx = (Number(params.page) - 1) * 50 + 1;
    endIdx = startIdx + 49;
}

const url = `http://openapi.foodsafetykorea.go.kr/api/${API_KEY}/${SERVICE_ID}/${DATA_TYPE}/${startIdx}/${endIdx}`;
// const url = "http://openapi.foodsafetykorea.go.kr/api/sample/COOKRCP01/json/1/5";

(async () => {
    let json = null;

    try {
        const response = await axios.get(url);
        json = response.data[SERVICE_ID].row; // API로 호출한 data에서 SERVICE_ID 항목의 row 항목이 곧 요리 데이터들
    } catch (e) {
        console.error(e);
        alert('요청을 처리하지 못했습니다.');
        return;
    } finally {
        document.querySelector('.loading').classList.remove('active');
        document.querySelector('.main-wrap').classList.add('active');
    }

    const listBody = document.querySelector('#listBody');   // 각 항목을 출력할 테이블 바디를 HTML에서 선택

    // 불러온 요리 개수만큼 반복(위 API 호출에서 start/end Index를 함께 주었기 때문에 50개씩 반복)
    json.forEach(v => {
        // 테이블의 한 줄로 들어갈 Element들 생성
        const tr = document.createElement('tr');
        const td1 = document.createElement('td');
        const td2 = document.createElement('td');
        const td3 = document.createElement('td');
        const td4 = document.createElement('td');
        // 데이터 추가 페이지로 이동시킬 버튼 생성
        const btn = document.createElement('button');
        btn.innerHTML = "추가하기";
        btn.addEventListener('click', e => {
            // 불러온 JSON = 요리 50개. forEach 중이니 v = 하나의 요리.
            // 하나의 요리 정보 전체를 JSON.stringify를 통해 JSON 정보를 담은 문자열 형태로 변경한 뒤
            // 세션스토리지에 저장해서 데이터 추가를 위한 입력 창으로 화면 이동(세션스토리지에 추가를 원하는 정보 저장한 채로)
            window.sessionStorage.setItem("selected", JSON.stringify(v));
            window.location = 'addRecipes-manual.html';
        });

        // 각 테이블 항목들 정보 채운 뒤 appendChild를 통해 본문에 각 요리 줄 추가
        td1.innerHTML = v.RCP_PAT2;
        td2.innerHTML = v.RCP_WAY2;
        td3.innerHTML = v.RCP_NM;
        td4.appendChild(btn);

        tr.appendChild(td1);
        tr.appendChild(td2);
        tr.appendChild(td3);
        tr.appendChild(td4);

        listBody.appendChild(tr);
    });
})();