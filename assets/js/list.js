import utilHelper from '../helper/UtilHelper.js';

let itemCnt = 12;       // 한 번에 불러올 새 요리 개수
let currentCnt = 0;     // 현재까지 불러온 위치 저장할 변수
let isLoading = false;  // 새 목록을 불러오기 전 스크롤 이벤트를 막아줄 boolean
let isEnd = false;      // 현재 목록 불러오기가 끝났는지 알려줄 boolean
insertList(currentCnt,itemCnt);
currentCnt += 12;

window.addEventListener('scroll', e => {
    // 목록 불러오기가 아직 진행중이면 return
    if (isLoading || document.querySelector('.loading').classList.contains('active')) {
        return;
    }

    const scrollTop = window.scrollY;                   // 스크롤 위치
    const windowHeight = window.screen.availHeight;     // 화면 높이
    const documentHeight = document.body.scrollHeight;  // 만든 문서 높이

    // 스크롤을 화면 맨 밑까지 하면 실행
    if (scrollTop + windowHeight >= documentHeight) {
        isLoading = true; // 진행중이라고 변수 변경
        if (!isEnd) { // isEnd = true => 작동안함, false => 작동함
            document.querySelector('.loading').classList.add('active');
        }
        insertList(currentCnt, itemCnt);
        currentCnt += 12;
    } 
});

// 화면에 새로운 12개 불러오기
async function insertList(currentCnt, itemCnt) {    
    const params = utilHelper.getUrlParams();
    const url = `http://localhost:3001/recipes/`;

    let json = null;

    try {
        const response = await axios.get(url);
        json = response.data;
    } catch (e) {
        console.error(e);
        alert('레시피를 불러오는데 실패했습니다');
        return;
    } finally { // 로딩바 해제
        document.querySelector('.loading').classList.remove('active');
    }

    // 온도나 시간을 선택한 상황이면 검색 전에 선택한거 유지
    if (params.time) {  // queryString에 time이란 변수가 있다면
        document.querySelector('#time').value = params.time;    // HTML의 selector(id = time)의 선택된 값을 그걸로 변경
        json = json.filter(v => v.time == params.time);         // 또한 화면에 출력할 요리들을 선택한 시간대에 어울리는 요리들로만 걸러냄
    }
    if (params.temp) {  // time과 마찬가지로 temp 음식 온도도 똑같이
        document.querySelector('#temp').value = params.temp;
        json = json.filter(v => v.temp == params.temp);
    }

    // 현재 위치부터 itemCnt만큼 반복. 여기선 12번
    for (let i = currentCnt; i < (currentCnt + itemCnt); i++) {
        // 더 불러올 요리 없으면 isEnd true로 바꿔주고(끝났다고 알리고) 멈춤
        if (!json[i]) {
            isEnd = true;
            break;
        }
        
        // 요리들을 추가할 div 선택
        const bot = document.querySelector('.section-bot');

        // 불러온 요리의 온도나 시간이 사용자가 선택한 option value와 다르면 추가 안하고 넘어감(continue)
        if (params.time && json[i].time != params.time) {
            continue;
        }
        if (params.temp && json[i].temp != params.temp) {
            continue;
        }

        // 화면에 Element 추가해서 뿌려줄 내용
        const list = document.createElement('div');
        list.classList.add('section-list');
        const a = document.createElement('a');
        a.setAttribute('href', `detail.html?id=${json[i].id}`)
        const img = document.createElement('img');
        img.setAttribute('src', json[i].ATT_FILE_NO_MAIN);
        img.setAttribute('alt', '조리사진');
        a.appendChild(img);
        const h3 = document.createElement('h3');
        h3.innerHTML = json[i].RCP_NM;

        list.appendChild(a);
        list.appendChild(h3);

        bot.appendChild(list);
    }

    isLoading = false;
};

export default insertList;