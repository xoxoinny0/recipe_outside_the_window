const url = `http://localhost:3001/recipes`;

async function recommend(nowTemp) {
    // ajax 받을 json
    let json = null;

    try {
        const response = await axios.get(url);
        json = response.data;
    } catch (e) {
        console.error(e);
        alert('음식을 불러오지 못했습니다.');
        return;
    }

    // weather.js에서 초기화한 현재 시간의 앞 두자(시간)
    const hour = Number(document.querySelector('#nowTime').innerHTML.substring(0, 2));
    console.log(hour);
    console.log(nowTemp);

    let time = '';
    let temp = '';

    // HTML에 표기된 현재 시간에 따라 추천할 음식 종류 변경
    if (hour <= 11 && hour > 5) {
        time = 'brunch';
    } else if ((hour <= 14 && hour > 11) || (hour <= 20 || hour > 17)) {
        time = 'meal';
    } else if (hour > 20) {
        time = 'night';
    } else {
        time = 'snack';
    }

    // 파라미터로 전달된 현재 기온에 따라 추천할 음식 종류 변경
    if (nowTemp <= 6) {
        temp = 'hot';
    } else if (nowTemp <= 24) {
        temp = 'prop';
    } else {
        temp = 'cold';
    }

    // 추천할 음식들 리스트
    const items = [];

    // 서버에서 불러온 전체 레시피 중, 추천할 종류에 맞는 애들만 item에 push
    json.forEach(v => {
        if (v.temp == temp && v.time == time) {
            console.log(v);
            items.push(v);
        }
    });

    // tiles = 페이지에 표시될 추천 음식 개수
    const tiles = Array.from(document.querySelectorAll('.recipe__about'));

    // 페이지 div 개수만큼 for 반복
    for (let i = tiles.length - 1; i >= 0; i--) {
        // 랜덤 숫자 생성 -> 불러온 요리 수 중 랜덤한 숫자 하나
        const rnd = Math.floor(Math.random() * items.length);
    
        // 해당 랜덤 수 인덱스에 해당하는 요리 선택
        const item = items[rnd];

        /* HTML의 div에 정보 입력 */
        // 각 recipe__about 내의 img 속성 변경
        tiles[i].children[0].setAttribute('src', item.ATT_FILE_NO_MAIN);
        tiles[i].children[0].addEventListener('click', e => {
            window.location = `detail.html?id=${item.id}`;
        });
        // img에 queryString에 사용할 dataset 할당
        tiles[i].children[0].setAttribute('data-time', item.time);
        tiles[i].children[0].setAttribute('data-way', item.RCP_WAY2);  

        // h3 이름 할당
        tiles[i].children[1].innerHTML = item.RCP_NM;

        // 불러온 요리의 시간/온도에 따라 innerHTML 변경 및 dataset 할당
        switch (item.time) {
            case 'brunch':
                tiles[i].children[2].children[0].innerHTML = "#브런치";
                tiles[i].children[2].children[0].setAttribute('data-time', 'brunch');
                break;
            case 'meal':
                tiles[i].children[2].children[0].innerHTML = "#식사";
                tiles[i].children[2].children[0].setAttribute('data-time', 'meal');
                break;
            case 'night':
                tiles[i].children[2].children[0].innerHTML = "#야식";
                tiles[i].children[2].children[0].setAttribute('data-time', 'night');
                break;
            case 'snack':
                tiles[i].children[2].children[0].innerHTML = "#간식";
                tiles[i].children[2].children[0].setAttribute('data-time', 'snack');
                break;
        }
        switch (item.temp) {
            case 'cold':
                tiles[i].children[2].children[1].innerHTML = "#차가운";
                tiles[i].children[2].children[1].setAttribute('data-temp', 'cold');
                break;
            case 'hot':
                tiles[i].children[2].children[1].innerHTML = "#뜨거운";
                tiles[i].children[2].children[1].setAttribute('data-temp', 'hot');
                break;
            case 'prop':
                tiles[i].children[2].children[1].innerHTML = "#적당한";
                tiles[i].children[2].children[1].setAttribute('data-temp', 'prop');
                break;
        }

        // 불러온 요리 정보에서 'HASH_TAG' key에 해당하는 정보가 문자열 'null'(음식 추가할 때 없는 정보는 문자열 'null' 넣었음)이 아니면
        if (item.HASH_TAG != 'null') {
            tiles[i].children[2].children[2].innerHTML = '#' + item.HASH_TAG; // 화면에 해시태그도 같이 출력
        } else {
            tiles[i].children[2].children[2].innerHTML = ''; // 없으면 해시태그는 비워놓기
        }

        // 화면에 출력한 요리는 출력 대기중인 리스트에서 제외
        const index = items.indexOf(item);
        items.splice(index, 1);
    }

    // 모든 작업이 끝나면 로딩바 해제
    document.querySelector('.loading').classList.remove('active');
    document.querySelector('.main-wrap').classList.add('active');
};

export default recommend;