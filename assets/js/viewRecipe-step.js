import utilHelper from '../helper/UtilHelper.js';

(async () => {
    const params = utilHelper.getUrlParams();

    // 쿼리 파라미터에 선택 요리에 대한 id가 없으면 오류
    if (!params.id) {
        alert('선택된 음식이 없습니다');
        return;
    }
    if (!params.step) {
        params.step = 1;
    }

    // 슬라이드 왼/오 버튼 href 할당
    document.querySelector('.slide-left > a').setAttribute('href', `detail2.html?id=${params.id}&step=${Number(params.step) - 1}`);
    document.querySelector('.slide-right > a').setAttribute('href', `detail2.html?id=${params.id}&step=${Number(params.step) + 1}`);
    
    const step = String(params.step).padStart(2, "0");

    const url = `http://localhost:3001/recipes/${params.id}`;
    let json = null;

    try {
        const response = await axios.get(url);
        json = response.data;
    } catch (e) {
        console.error(e);
        alert('음식을 불러오지 못했습니다.');
        return;
    } finally {
        document.querySelector('.loading').classList.remove('active');
        document.querySelector('.detail_wrap').classList.add('active');
    }

    console.log(json);

    document.querySelector('.img_wrap > img').setAttribute('src', json[`MANUAL_IMG${step}`]);

    document.querySelector('.img_wrap > p').innerHTML = json[`MANUAL${step}`];

    if (!json[`MANUAL${String(Number(params.step) - 1).padStart(2, "0")}`]) {
        document.querySelector('.slide-left > a').setAttribute('href', `detail.html?id=${params.id}`);
    }
    if (!json[`MANUAL${String(Number(params.step) + 1).padStart(2, "0")}`]) {
        document.querySelector('.slide-right > a').setAttribute('href', `detail3.html?id=${params.id}&step=${Number(step) + 1}`);
    }

    let last = 0;

    for (const k in json) {
        if (k.indexOf('MANUAL') != -1) {
            last++;
        }
    }

    last = last / 2 + 1;

    document.querySelector('.go_to_youtube > a').setAttribute('href', `detail3.html?id=${params.id}&step=${last}`);
})();