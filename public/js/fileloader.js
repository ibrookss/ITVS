function FileConstructor(content, id) {
    this.id = id;
    this.content = content;
    this.addBlock = function (id) {
        //Изменить на append child
        fl.stackBlock.innerHTML += `
            <tr id="file-${id}">
                <td>
                    <a>${this.content.name}</a>
                    <div class="progressBar"></div>
                </td>
                <td><button onclick="fl.stack[${this.id}].upload('/upload', 'post');">Загрузить</button></td>
                <td><button onclick="fl.stack[${this.id}].cancel()">Отменить</button></td>
            </tr>`;
    }
    //Добавить обработку ответов сервера
    this.upload = (url, method) => {
        if (fl.stack[this.id]) {
            let file = this.content;
            console.log(file)
            let xhr = new XMLHttpRequest();
            let form = new FormData();
            form.append("document", file);
            xhr.upload.addEventListener('progress', this.uploadProgress, false);
            xhr.onreadystatechange = this.stateChange;
            xhr.open('POST', url);
            xhr.setRequestHeader('X-FILE-NAME', file.name);
            xhr.send(form);
        }
    }
    this.cancel = () => {
            delete fl.stack[this.id];
            document.querySelector(`#file-${this.id}`).style.display = 'none';
    }
    this.stateChange = (event) => {
        //Будь добр обработай все стадии
        if (event.target.readyState == 4) {
            if (event.target.status == 200) {
                    document.querySelector(`#file-${this.id}`).children[0].innerHTML = 'Загрузка успешно завершена!';
                    document.querySelector(`#file-${this.id}`).children[2].innerHTML = '';
            } else {
                    document.querySelector(`#file-${this.id}`).children[0].innerHTML = 'Нихуя';
                    document.querySelector(`#file-${this.id}`).children[1].innerHTML = '';
            }
        }
    }
    //Это что за **** ?
    this.uploadProgress = (event) => {
        if (fl.stack[this.id]) {
            let percent = parseInt(event.loaded / event.total * 100);
            //document.querySelector(`#file-${this.id}`).firstElementChild.innerHTML = 'Загрузка: ' + percent + '%';
            document.querySelector(`#file-${this.id}`).children[0].children[1].style.width = percent+'%';
            document.querySelector(`#file-${this.id}`).children[1].innerHTML = '';
        }
    }
}
function fileloader(block, url, stackBlock) {
    this.block = document.getElementById(block);
    this.stackBlock = document.getElementById(stackBlock)
    this.url = url;
    this.stack = [];
    this.lastId = 0;
    this.init = () => {
        this.block.addEventListener('dragenter', this.dropZoneEnter);
        this.block.addEventListener('dragover', this.dropZoneOver);
        this.block.addEventListener('dragleave', this.dropZoneLeave);

        this.block.addEventListener('drop', (e) => {
            this.dropZoneDrop(e);
        });
    }
    this.dropZoneEnter = (e) => {
        e.stopPropagation();
        e.preventDefault();
    }
    this.dropZoneOver = (e) => {
        e.stopPropagation();
        e.preventDefault();
    }
    this.dropZoneLeave = (e) => {
        e.stopPropagation();
        e.preventDefault();
    }
    this.dropZoneDrop = (e) => {
        e.stopPropagation();
        e.preventDefault();
        this.files = e.dataTransfer.files;
        for (let i = 0; i < this.files.length; i++) {
            let file = this.files[i];
            this.addToStack(i)
        }
        return false;
    }
    this.addToStack = (fileId) => {
        let fileCell = new FileConstructor(this.files[fileId], this.lastId);
        this.stack[this.lastId] = fileCell;
        fileCell.addBlock(this.lastId);
        this.lastId++;
    }
}
let fl = new fileloader('fileloader', '/upload', 'fileStack');
fl.init();
