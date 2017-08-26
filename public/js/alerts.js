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
        let alertClass = status == 1 ? 'alertSuccess' : 'alertWarning'
        document.getElementById(this.block).innerHTML +=
        `
            <div class="alert ${alertClass}" id="alert-${this.count}" onclick="customAlerts.remove(${this.count})">
                <div>${message}</div>
                <div id="alertLifeTime"></div>
            </div>
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
