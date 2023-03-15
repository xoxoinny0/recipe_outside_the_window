import utilHelper from '../helper/UtilHelper.js';

(async () => {
    const params = utilHelper.getUrlParams();

    // queryString에 요리 id값이 없으면 종료
    if (!params.id) {
        alert('선택된 요리가 없습니다');
        return;
    }

    // 선택된 id에 맞는 한 개의 레시피 불러오기
    const url = `http://localhost:3001/recipes/${params.id}`;
    let json = null;

    try {
        const response = await axios.get(url);
        json = response.data;
    } catch (e) {
        console.error(e);
        alert('음식을 불러오지 못했습니다.');
        return;
    } finally { // 로딩바 종료
        document.querySelector('.loading').classList.remove('active');
        document.querySelector('.detail_wrap').classList.add('active');
    }

    // 이미지부터 바꿔줌
    document.querySelector('.img_wrap > img').setAttribute('src', json.ATT_FILE_NO_MAIN);

    const descriptions = document.querySelectorAll('.description__content');

    // description 안의 각 content 내용 삽입
    descriptions[0].innerHTML = json.RCP_NM;
    descriptions[1].innerHTML = json.RCP_PARTS_DTLS;
    descriptions[2].innerHTML = json.RCP_WAY2;
    descriptions[3].innerHTML = json.RCP_PAT2;
    descriptions[4].innerHTML = json.INFO_ENG;

    // 슬라이드 오른쪽 버튼에 queryString 포함한 href 링크 할당
    document.querySelector('.slide-right > a').setAttribute('href', `detail2.html?id=${params.id}`);

    /* 각 요리의 마지막 메뉴얼 번호를 구하기 위한 내용 */
    let last = 0;

    for (const k in json) {
        if (k.indexOf('MANUAL') != -1) {
            last++;
        }
    }

    last = last / 2 + 1;

    document.querySelector('.go_to_youtube > a').setAttribute('href', `detail3.html?id=${params.id}&step=${last}`);
})();