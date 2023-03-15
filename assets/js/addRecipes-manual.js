import utilHelper from '../helper/UtilHelper.js';

// http://openapi.foodsafetykorea.go.kr/api/인증키/서비스명/요청파일타입/요청시작위치/요청종료위치

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
 const startIdx = "1";
 const endIdx = "5";

// const url = "http://openapi.foodsafetykorea.go.kr/api/sample/COOKRCP01/json/1/5";
let url = `http://openapi.foodsafetykorea.go.kr/api/${API_KEY}/${SERVICE_ID}/${DATA_TYPE}/${startIdx}/${endIdx}`;

const selected = JSON.parse(sessionStorage.getItem('selected'));    // 세션스토리지에서 'selected'란 이름의 정보 가져옴(요리에 대한 정보, JSON.parse로 문자열을 JSON으로)
if (!selected) {    // 세션스토리지에서 불러올 정보가 없으면 오류 후 뒤로
    alert('잘못된 접근입니다');
    history.back();
} else {            // 있으면 로딩바 해제
    document.querySelector('.loading').classList.remove('active');
    document.querySelector('.main-wrap').classList.add('active');
    // 불러와서 새 변수(객체)에 저장해놨으니 세션스토리지에서 해당 내용 삭제
    window.sessionStorage.removeItem('selected');
}

let manualCnt = 0;  // 추가 페이지에 표시할 레시피 몇단계인지 알려줄 변수
let manual = {};    // 레시피 단계별 정보를 저장할 빈 JSON 객체
// for - in 이므로 불러온 요리 JSON의 key 수만큼 반복
for (const k in selected) {
    const element = document.querySelector(`#${k}`);    // HTML에서 요리 정보 각 key값과 같은 id를 가진 요소 불러옴
    if (element) { // 요소를 찾았을 때
        if (element.id == "ATT_FILE_NO_MAIN") { // 요소가 이미지를 저장할 'ATT_FILE_NO_MAIN'라면
            document.querySelector(`#${k}`).setAttribute('src', selected[k]); // setAttribute로 img src를 할당,
        } else { // 이미지 아니면(본 페이지에선 img 아니면 전부 input)
            element.setAttribute('value', selected[k] || "null"); // input의 value를 불러온 값으로 초기화해줌
        }
    }

    // 서버에서 불러온 요리 정보 JSON의 각 항목에 'MANUAL'이란 문자가 포함되어 있다? -> 레시피 단계 정보
    if (k.indexOf("MANUAL") != -1 && selected[k] != "") { // 레시피에 관한 key이면서 value가 비어있지 않으면 -> 추가해야할 데이터
        manualCnt++; // 레시피 단계 개수를 1 증가시켜주고
        manual[k] = selected[k]; // 레시피 각 단계를 저장할 JSON 객체 안에 해당 단계 추가
    }
}

// 레시피 단계 개수를 표시하는 input의 내용 초기화(서버에서 불러온 JSON에서 'MANUAL' 문자열이 포함된 키는 단계 별 2개 씩 있음(사진, 설명) -> 나누기 2)
document.querySelector('#step').setAttribute('value', manualCnt / 2);

// 요리 데이터 추가 폼 submit event
document.querySelector('#addRecipe-form__submit').addEventListener('click', async e => {
    e.preventDefault(); // 폼 기본 효과 막기

    url = "http://localhost:3001/recipes" // 새로 저장할 고유 서버 주소

    // 저장할 내용을 담을 빈 JSON. 세션스토리지로 데려온 JSON은 불필요한 내용까지 담고 있기에 바로 사용 x,
    // 저장 전 수정을 위해 화면 form에 뿌려준 form 안의 데이터들만 저장할 예정.
    const json = {};

    // form의 각 input들을 가르키고 있는 label들
    const labels = document.querySelectorAll('label');

    // 라벨 개수 = 폼 내 입력창 개수(저장 필요한 데이터 수)
    labels.forEach(v => {
        const key = v.getAttribute('for');  // label의 for Attribute는 라벨이 가르키는 엘레멘트의 id를 의미
        if (key == "ATT_FILE_NO_MAIN") {    // 저장을 원하는 데이터의 id가 이미지를 의미하는 key라면
            json["ATT_FILE_NO_MAIN"] = document.querySelector(`#ATT_FILE_NO_MAIN`).src; // 미리보기 이미지의 src를 그대로 저장
        } else {    // 아니라면(= input)
            json[key] = document.querySelector(`#${key}`).value; // 새 JSON 객체에 새로운 key와 value 할당(저장할 내용)
        }
    });

    // 위에서 미리 저장해두었던 각 레시피 단계별 정보들 또한 json에 추가해줌
    for (const k in manual) {
        json[k] = manual[k];
    }

    // post 메서드를 통해 고유 데이터베이스에 추출한 내용 json 저장
    try {
        const response = await axios.post(url, json);
        // 그 후 추가한 아이디의 상세 페이지로 이동. response의 data는 추가된 JSON을 의미, id는 자동 추가. 자동 추가된 고유 id를 queryString에 이용
        window.location = `recipeDetail.html?itemNo=${response.data.id}`;
    } catch (e) {
        console.error(e);
        alert("데이터 추가 실패");
        return;
    }
});