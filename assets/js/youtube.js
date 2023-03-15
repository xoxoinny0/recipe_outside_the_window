import utilHelper from '../helper/UtilHelper.js';

const API_KEY = "AIzaSyB4VLp6uBZR8HKxswQG3SKOMrTzT6u6RIY";

const params = utilHelper.getUrlParams();
// const searchKeyword = encodeURI(params.id.RCP_NM);
let searchKeyword = "";

const localUrl = `http://localhost:3001/recipes/${params.id}`;

(async() => {
    let json = null;

    try {
        const response = await axios.get(localUrl);
        json = response.data;
        searchKeyword = json.RCP_NM;
    } catch (e) {
        console.error(e);
        alert('요청을 처리하지 못했습니다.');
        return;
    }

    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${searchKeyword}&maxResults=3&key=${API_KEY}`;

    try {
        const response = await axios.get(url);
        json = response.data;
    } catch (e) {
        console.error(e);
        alert('요청을 처리하지 못했습니다.');
        return;
    } finally {
        document.querySelector('.loading').classList.remove('active');
        document.querySelector('.detail_wrap').classList.add('active');

    }

    // console.log(json);    

    document.querySelectorAll('.wrap2').forEach((v, i) => {
        v.querySelector('.left > a').setAttribute('href', `https://www.youtube.com/watch?v=${json.items[i].id.videoId}`);
        v.querySelector('.left > a').setAttribute('target', '_blank');
        v.querySelector('.left > a > img').setAttribute('src', json.items[i].snippet.thumbnails.medium.url);
        v.querySelector('.title').innerHTML = json.items[i].snippet.title;
        v.querySelector('.channelTitle').innerHTML = json.items[i].snippet.channelTitle;
        v.querySelector('.description').innerHTML = json.items[i].snippet.description;
})

    console.log(json.items[0]);
    console.log(json.items[0].snippet);
})();