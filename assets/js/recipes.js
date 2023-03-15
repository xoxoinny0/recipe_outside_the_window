const url = `http://localhost:3001/recipes`;

(async () => {

    let json = null;

    try {
        const response = await axios.get(url);
        json = response.data;
    } catch (e) {
        console.error(e);
        alert('요청을 처리하지 못했습니다.');
        return;
    } finally {
        document.querySelector('.loading').classList.remove('active');
        document.querySelector('.main-wrap').classList.add('active');
    }

    const listBody = document.querySelector('#listBody');

    json.forEach(v => {
        const tr = document.createElement('tr');

        const td1 = document.createElement('td');
        const td2 = document.createElement('td');
        const td3 = document.createElement('td');
        const td4 = document.createElement('td');
        const td5 = document.createElement('td');
        const a = document.createElement('a');
        a.setAttribute('href', `recipeDetail.html?itemNo=${v.id}`);
        const td6 = document.createElement('td');
        const btn = document.createElement('button');
        btn.innerHTML = "삭제";
        btn.classList.add('btnDel');
        btn.dataset.id = v.id;
        btn.dataset.name = v.RCP_NM;

        td1.innerHTML = v.time;
        td2.innerHTML = v.temp;
        td3.innerHTML = v.RCP_PAT2;
        td4.innerHTML = v.RCP_WAY2;
        a.innerHTML = v.RCP_NM;
        td5.appendChild(a);
        td6.appendChild(btn);

        tr.appendChild(td1);
        tr.appendChild(td2);
        tr.appendChild(td3);
        tr.appendChild(td4);
        tr.appendChild(td5);
        tr.appendChild(td6);

        listBody.appendChild(tr);
    });

    const btnDel = document.querySelectorAll('.btnDel');

    btnDel.forEach(v => {
        v.addEventListener('click', async e => {
            e.preventDefault();

            const current = e.currentTarget;
            const id = current.dataset.id;
            const name = current.dataset.name;

            if (confirm(`정말 ${name}을 삭제하시겠습니까?`)) {
                try {
                    await axios.delete(`http://localhost:3001/recipes/${id}`);
                    
                } catch (e) {
                    console.error(e);
                    alert('요청을 처리하는데 실패했습니다.');
                    return;
                }
            }
        });
    });
})();