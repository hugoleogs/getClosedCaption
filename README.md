# getClosedCaption

<p align="justify">
O objetivo deste website é auxiliar as pessoas na hora de criar seus closed captions ( cc), com esse site você não precisa escrever tudo na mão, 
basta só falar e depois fazer o download do arquivo se desejar.
</p>

## Modo de uso

<p align="justify">
1 - Copiar a URL do seu video do youtube que você irá narrar e colar na barra de pesquisa e em seguida pressionar a tecla <b>Pesquisar</b>. (Opcional)

2 - Pressionar a tecla <b>Escrever</b> e iniciar a sua narrativa

3 - Você tem a opção de traduzir para inglês (Opcional)

4 - Fazer o download dos dois arquivos (Original e o traduzido)

A seguir um GIF para demonstração

</p> 
  
![Imagem_Ciclo_Git](https://github.com/hugoleogs/getClosedCaption/blob/main/img/gravacao.gif)

## Código

<p align="justify">
O youtube disponibiliza vários tipos de URLs para o mesmo vídeo, nesse trecho de código recebemos o tipo específico onde no meio da URL vem a 
  palavra <i><b>watch?v=</b></i> e trocamos por <i><b>embed/</i></b> para localizar o vídeo. Obs: há casos onde a URL do vídeo faz parte de uma playlist. Observação: 
  não estamos tratando esse caso.
</p>

```Js
function evento1() {
    const entrada = document.querySelector("#email")
    const set_video = document.querySelector("#video")
    set_video.setAttribute('src', `${entrada.value.replace("watch?v=", "embed/")}`)
}
```

<p align="justify">
O trecho a seguir, faz a solicitação via POST a API do Google para realizar a tradução do texto. Observação: é necessário colocar sua "CREDENCIAL"
</p>

```Js
let translate = async (text) => {
    let res = await axios.post(
        `https://translation.googleapis.com/language/translate/v2?key=/**CHAVE_DA_SUA_CREDENCIAL_AQUI**/`,
        { q: text, target: "en" }
    );
    let translation = res.data.data.translations[0].translatedText
    return translation
}
```

<p align="justify">
Precisamos reconhecer se o browser possui a API e em seguida ativar as configurações necessárias. Como é realizado no código a seguir:
</p>

```Js
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
```

<p align="justify">
Por fim, e não menos importante, é necessário criar os controles de iniciar e parar a aplicação.
</p>

```Js
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
```

## Link do websit : <https://getclosedcaptionv2.netlify.app/>
