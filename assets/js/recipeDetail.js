import utilHelper from '../helper/UtilHelper.js';

const params = utilHelper.getUrlParams();

if (!params.itemNo) {
    alert('오류');
    history.back();
} else {
    document.querySelector('#btnDel').dataset.id = params.itemNo;
}
const url = `http://localhost:3001/recipes/${params.itemNo}`;

(async () => {

    let json = null;

    try {
        const response = await axios.get(url);
        json = response.data;
        console.log(json);
    } catch (e) {
        console.error(e);
        alert('요청을 처리하지 못했습니다.');
        return;
    } finally {
        document.querySelector('.loading').classList.remove('active');
        document.querySelector('.main-wrap').classList.add('active');
    }

    for (const k in json) {
        const element = document.querySelector(`#${k}`);
        if (element) {
            if (k == "ATT_FILE_NO_MAIN") {
                element.setAttribute('src', json[k] || "null");
            } else {
                element.innerHTML = json[k] || "null";
            }
        }
    }
})();