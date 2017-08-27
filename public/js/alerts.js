function customAlert(block) {
    this.block = block
    this.count = 0;
    this.captcha = {
        captcha_key: false,
        captcha_sid: false
    };
    this.lifeTime = 5;
    this.alerts = [];
    this.remove = (id) => {
        //Удаляем из DOM и Массива
        if (this.alerts[id]) {
            document.getElementById(`alert-${id}`).remove()
            delete this.alerts[id]
        }
    }
    this.create = function (status, message) {
        //Проверяем что сделать, инкрементировать ID или начать с нуля если все нотификации уже скрыты
        this.alerts[this.count] != undefined
            ? this.count++
            : this.count = 1;
        //Рендерим новую нотификацию
        let alertClass = status == 1 ? 'success success message-success alert-success' : 'alert error message-error alert-error'
        document.getElementById(this.block).innerHTML +=
        `
            <li class="messenger-message-slot messenger-shown messenger-first messenger-last" id="alert-${this.count}">
                <div class="messenger-message message ${alertClass} messenger-will-hide-after">
                    <button type="button" class="messenger-close" onclick="customAlerts.remove(${this.count})">×</button>
                    <div class="messenger-message-inner">${message}</div>
                    <div class="messenger-spinner">
                        <span class="messenger-spinner-side messenger-spinner-side-left">
                            <span class="messenger-spinner-fill"></span>
                        </span>
                        <span class="messenger-spinner-side messenger-spinner-side-right">
                            <span class="messenger-spinner-fill"></span>
                        </span>
                    </div>
                </div>
            </li>
        `
        //Добавляем новую нотификацию в массив
        this.alerts[this.count] = {
            id: this.count,
            status: status,
            message: message
        }
        //Через секунду запускаем удаление
        setTimeout(this.remove, this.lifeTime*1000, this.count);
    }
    this.updateCaptcha = function(captcha_sid) {
        this.captcha = {
            captcha_key: document.querySelector('#captchaValue').value,
            captcha_sid: captcha_sid
        }
        console.log(this.captcha)
    }
    this.createCaptcha = function (imgUrl, sid) {
        // <li class="messenger-message-slot messenger-shown messenger-first messenger-last" id="alert-${this.count}">
        //     <img src="${imgUrl}" width = "300px" />
        //     <input type="text" id="captchaValue" />
        //     <input type="button" value="Подтвердить" onclick="customAlerts.updateCaptcha(${sid})" />
        // </li>
        document.querySelector('#captchas').innerHTML =
        `
            <div id="myModal" class="modal fade in" tabindex="-1" role="dialog" style="display: block;">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <button type="button" class="close" onclick="document.querySelector('#captchas').innerHTML = '' ">×</button>
                            <h4 class="modal-title" id="myModalLabel">Проверка на бота</h4>
                        </div>
                        <div class="modal-body">
                            <div class="thumbnail">
                                <img src="${imgUrl}" />
                            </div>
                            <div class="form-group">
                              <label for="normal-field" class="col-sm-4 control-label">Код с картинки сверху</label>
                              <div class="col-sm-7">
                                  <input type="text" class="form-control" placeholder="fgsdfs4df5" id="captchaValue" />
                              </div>
                            </div>
                            <br/><br/>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-primary" onclick="customAlerts.updateCaptcha(${sid})" >Отправить капчу</button>
                        </div>
                    </div>
                </div>
            </div>
        `
    }
}

let customAlerts = new customAlert('alerts');
customAlerts.createCaptcha('', 123);
