function customAlert(block) {
    this.block = block
    this.count = 0;
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
}

let customAlerts = new customAlert('alerts');

document.getElementById(`fileloader`).addEventListener('click', () => {
    customAlerts.create(1, 123);
})
