//converte a url do youtube
function evento1() {
    const entrada = document.querySelector("#email")
    const set_video = document.querySelector("#video")
    set_video.setAttribute('src', `${entrada.value.replace("watch?v=", "embed/")}`)
}

//converte audio em texto
function iniciar_api() {

    const btn = document.getElementById('btn')
    const result = document.getElementById('caixa1')

    if (window.SpeechRecognition || window.webkitSpeechRecognition) {

        //cria um objeto da api
        var speech_api = window.webkitSpeechRecognition || window.SpeechRecognition
        const MySpeech = new speech_api()

        //necessário para api não parar de gravar!!
        MySpeech.continuous = true
        MySpeech.interimResults = true
        MySpeech.lang = "pt-BR"
        MySpeech.ativo = false
        let passado = ''

        //salva o ultimo estado do texto na textarea
        MySpeech.onresult = function(event){
            result.textContent = "";
            for (var i = event.resultIndex; i < event.results.length; i++) {
                if(event.results[i].isFinal){
                    result.textContent = passado + ' ' + event.results[i][0].transcript
                    passado = result.value
                 }else{
                    result.textContent += event.results[i][0].transcript
                }
            }
        }
        //Inicia e para a api de gravar/escrever
        const onClick = () => {

            try {
                if (!MySpeech.ativo) {
                    MySpeech.start()
                    result.innerHTML = ''
                    $('#btn').html('Parar Escrita?')
                    MySpeech.ativo = true
                } else {
                    MySpeech.stop()
                    MySpeech.ativo = false
                    $('#btn').html('Voltar a Escrever?')
                }
            } catch (error) {
                alert('ERRO!!! ' + error.message)
            }

        }


        btn.addEventListener('click', onClick)
    } else {
        result.innerHTML = "Seu navegador não tem suporte a API"
    }

}

//faz a solicitação da tradução de um tempo para a api do google 
let translate = async (text) => {
    let res = await axios.post(
        `https://translation.googleapis.com/language/translate/v2?key=/**CHAVE_DA_SUA_CREDENCIAL_AQUI**/`,
        { q: text, target: "en" }
    );
    let translation = res.data.data.translations[0].translatedText
    return translation
}

$(document).on('click', '#btn2', function () {

    translate($('#caixa1').text()).then(x => $('#caixa2').html(x))

})

// Função que faz o dosnload do material
$(document).on('click', '#btn3', function () {

    let textoTranslate = $('#caixa2').text()
    let bloco = new Blob([textoTranslate], { type: "text/plain;charset=utf-8" })
    saveAs(bloco, "textTranslate.txt")

    let textoOri = $('#caixa1').text()
    let blocoOri = new Blob([textoOri], { type: "text/plain;charset=utf-8" })
    saveAs(blocoOri, "textOriginale.txt")
})