function FileConstructor(content, id) {
    this.id = id;
    this.content = content;
    this.percents = [];
    this.addBlock = function (id) {
        //Изменить на append child
        // fl.stackBlock.innerHTML += `
        //     <tr id="file-${id}">
        //         <td style="width: 100px;">
        //
        //         </td>
        //         <td>
        //             <a>${this.content.name}</a>
        //             <div class="progressBar" ></div>
        //         </td>
        //         <td><button onclick="fl.stack[${this.id}].upload('/upload', 'post');">Загрузить</button></td>
        //         <td><button onclick="fl.stack[${this.id}].cancel()">Отменить</button></td>
        //     </tr>`;

        fl.stackBlock.innerHTML += (`
            <tr class="template-upload fade in" id="file-${id}">
                <td width="12%">
                    <span class="preview"><canvas width="50px" height="50px" id="file-preview-${id}"></canvas></span>
                </td>
                <td width="20%">
                    <p class="name">${this.content.name}</p>
                    <strong class="error text-danger"></strong>
                </td>
                <td width="34%">
                    <p class="size" id="file-size-${this.content.id}">${Math.floor(this.content.size / 1024)} Кб</p>
                    <div class="progress progress-xs active" role="progressbar">
                        <div class="progress-bar progress-bar-success"  id="file-progress-${id}"></div>
                    </div>
                </td>
                <td width="34%">
                    <button class="btn btn-primary btn-sm start" id="file-start-button-${id}" onclick="fl.stack[${this.id}].upload('/upload', 'post');">
                        <i class="fa fa-upload"></i>
                        <span> Старт</span>
                    </button>
                    <button class="btn btn-warning btn-sm cancel" id="file-cancel-button-${id}" onclick="fl.stack[${this.id}].cancel()">
                        <i class="fa fa-ban"></i>
                        <span> Отмена</span>
                    </button>
                </td>
            </tr>
        `)
    }
    //Добавить обработку ответов сервера
    this.upload = (url, method) => {
        if (fl.stack[this.id]) {
            let file = this.content;
            console.log(file)
            if (file.type == 'image/gif' ||
                file.type == 'image/png' ||
                file.type == 'image/jpeg') {
                let xhr = new XMLHttpRequest();
                let form = new FormData();
                form.append("document", file);

                //СЮДА КАПЧУ ПЕРЕДАТЬ
                form.append("captcha", JSON.stringify(customAlerts.captcha));
                xhr.upload.addEventListener('progress', this.uploadProgress, false);
                xhr.onreadystatechange = this.stateChange;
                xhr.open('POST', url);
                xhr.setRequestHeader('X-FILE-NAME', file.name);
                xhr.send(form);

                document.querySelector(`#file-start-button-${this.id}`).style.display = "none";
                //document.querySelector(`file-cancel-button-${this.id}`).style.display = "none";
            } else {
                customAlerts.create(0, 'ты шо ебанутый? Сказал же что расширение кривое');
            }
        }
    }
    this.cancel = (time) => {
        time = time || 0;
        setTimeout(() => {
            delete fl.stack[this.id];
            document.querySelector(`#file-${this.id}`).style.display = 'none';
        }, time)
    }
    this.update = () => {
        document.querySelector(`#file-start-button-${this.id}`).style.display = "inline";
        document.querySelector(`#file-progress-${this.id}`).style.width = '0%';
    }
    this.stateChange = (event) => {
        //Будь добр обработай все стадии
        if (event.target.readyState == 4) {
            if (event.target.status == 200) {
                    let response = JSON.parse(event.currentTarget.response);
                    customAlerts.create(response.status, response.message)
                    if (response.status == 1) {
                        this.cancel(1000);
                    } else{
                        this.update();
                        console.log(response)
                        if (response.error.error_code == 14) {
                            customAlerts.createCaptcha(response.error.captcha_img, response.error.captcha_sid);
                        }
                    }
            } else {
                    customAlerts.create(0, 'Произошла ошибка')
            }
        }
    }
    //Это что за **** ?
    this.uploadProgress = (event) => {
        if (fl.stack[this.id]) {
            let percent = parseInt(event.loaded / event.total * 100);
            //document.querySelector(`#file-${this.id}`).firstElementChild.innerHTML = 'Загрузка: ' + percent + '%';
            document.querySelector(`#file-progress-${this.id}`).style.width = percent+'%';
            if (percent == 100) {
                customAlerts.create(1, 'Ваше изображение загружено и обрабатывается серверами Вконтакте');
            }
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
        this.block.style.border = "2px dashed #00ff17";
        this.block.innerHTML = "Бросайте :)"
    }
    this.dropZoneOver = (e) => {
        e.stopPropagation();
        e.preventDefault();
    }
    this.dropZoneLeave = (e) => {
        e.stopPropagation();
        e.preventDefault();
        this.block.innerHTML = "Перетащите сюда файлы"
        this.block.style.border = "2px dashed #eee"
    }
    this.dropZoneDrop = (e) => {
        e.stopPropagation();
        e.preventDefault();
        this.files = e.dataTransfer.files;
        this.block.innerHTML = "Перетащите сюда файлы"
        this.block.style.border = "2px dashed #eee"
        for (let i = 0; i < this.files.length; i++) {
            let file = this.files[i];
            console.log(file)
            if (file.type == 'image/gif' ||
                file.type == 'image/png' ||
                file.type == 'image/jpeg') {
                this.addToStack(i);
                //Вычитаем 1 т.к в предыдущей функции уже инкрементировали
                this.showPreloadImg(file, this.lastId-1);
            }else{
                customAlerts.create(0, `Файл ${file.name} имеет странное расширение`);
            }
        }
        return false;
    }
    this.showPreloadImg = (file, id) => {
        if (file) {
          var fr = new FileReader();
          fr.addEventListener("load", () => {
            document.querySelector(`#file-preview-${id}`).style.backgroundImage = "url(" + fr.result + ")";
            document.querySelector(`#file-preview-${id}`).style.backgroundSize = "auto 50px";
            document.querySelector(`#file-preview-${id}`).style.backgroundRepeat = "no-repeat";
            document.querySelector(`#file-preview-${id}`).style.backgroundPosition = "center";
          }, false);

          fr.readAsDataURL(file);
        }
    }
    this.addToStack = (fileId) => {
        this.stackLength = 0;
        for (i in this.stack) {
            this.stackLength += 1;
        }
        if (this.stackLength < 10) {
            let fileCell = new FileConstructor(this.files[fileId], this.lastId);
            this.stack[this.lastId] = fileCell;
            fileCell.addBlock(this.lastId);
            this.lastId++;
        } else {
            customAlerts.create(0, 'Нельзя добавить больше чем 10 файлов за раз')
        }
    }
    this.startAll = () => {
        for (fileCell of fl.stack) {
            if (fileCell) {
                fl.stack[fileCell.id].upload('/upload', 'post')
            }
        }
    }
    this.cancelAll = () => {
        for (fileCell of fl.stack) {
            if (fileCell) {
                fileCell.cancel();
            }
        }
    }
}
let fl = new fileloader('fileloader', '/upload', 'fileStack');
fl.init();
