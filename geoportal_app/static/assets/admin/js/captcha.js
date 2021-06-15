(function () {
    const height = 60
    const width = 100
    let main_captcha_value = ''
    let captcha_value = ''

    let captchaValueElement = document.getElementById("id_captcha")
    var canvas = document.getElementById("myCanvas");
    var ctx = canvas.getContext("2d");

    canvas.height = height
    canvas.width = width
    canvas.style.backgroundColor = "#0B3A7D"
    canvas.style.cursor = "pointer"
    makeCaptcha()

    canvas.addEventListener("click", function() {
        makeCaptcha()
    })

    function fifty(size) {
        return size / 2
    }

    function makeCaptcha() {
        ctx.clearRect(0, 0, width, height);
        ctx.font = "30px Arial";
        ctx.fillStyle = "#00A3CF";
        ctx.textAlign = "center";
        let text = passwordGenerate(4)
        main_captcha_value = text
        ctx.fillText(text, fifty(canvas.width), fifty(canvas.height + height / 4));
        drawRandomLine()
    }

    function drawRandomLine(length=50) {
        for (let i = 0; i <= length; i++) {
            let from = [getRandomNumber(height), getRandomNumber(width)]
            let to = [getRandomNumber(height * 2), getRandomNumber(width * 2)]
            drawLine(from, to)
        }
    }

    function drawLine(from, to, color) {
        let [fromStart, fromEnd] = from
        let [toStart, toEnd] = to
        ctx.beginPath();
        ctx.moveTo(fromStart, fromEnd);
        ctx.lineTo(toStart, toEnd);
        ctx.lineWidth = 1;
        ctx.strokeStyle = '#00A3CF';
        ctx.stroke();
    }

    function passwordGenerate(length) {
        let chars = 'qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM123456789'
        let password = ''
        for (let i = 0; i <= length; i++) {
            password += chars.charAt(getRandomNumber(chars.length));
        }
        return password
    }

    function getRandomNumber(length) {
        return Math.floor(Math.random() * length)
    }

    function getFormElem(element) {
        let name = ""
        while (false == false) {
            element = element.parentElement
            name = element.tagName
            if (name == 'FORM') {
                break
            }
        }
        return element
    }

    let formBtnElement = document.getElementById('formBtn')
    formBtnElement.addEventListener('click', handleSubmit)
    let form = getFormElem(formBtnElement)
    form.addEventListener('keypress', listenKey)

    function createInput(name, value) {
        let element = document.createElement('input')
        element.type = "text"
        element.name = name
        element.value = value
        element.style.display = "none"
        return element
    }

    function listenKey(event) {
        if (event.key == 'Enter') {
            handleSubmit()
        }
    }

    function handleSubmit(event) {
        captcha_value = captchaValueElement.value
        let inputElement = createInput('captcha_check', captcha_value)
        let mainCapValueElem = createInput('captcha_main', main_captcha_value)
        form.appendChild(inputElement)
        form.appendChild(mainCapValueElem)
        form.submit()
    }
})();