function customAlert() {
    this.count = 0;
    this.alerts = [];
    this.remove = (id) => {
        //Удаляем из DOM и Массива
        document.getElementById(`alert-${id}`).remove()
        delete this.alerts[id]
    }
    this.create = function (status, message) {
        //Проверяем что сделать, инкрементировать ID или начать с нуля если все нотификации уже скрыты
        this.alerts[this.count] != undefined
            ? this.count++
            : this.count = 1;
        //Рендерим новую нотификацию
        document.getElementById('fileloader').innerHTML +=
        `
            <div id="alert-${this.count}">${this.count}</div>
        `
        //Добавляем новую нотификацию в массив
        this.alerts[this.count] = {
            id: this.count,
            status: status,
            message: message,
        }
        //Через секунду запускаем удаление
        setTimeout(this.remove, 1000, this.count);
    }
}

let customAlerts = new customAlert();

document.addEventListener('click', () => {
    customAlerts.create(1, 123);
})
