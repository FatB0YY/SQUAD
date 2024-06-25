![[Pasted image 20240528120642.png|200]]
![[Pasted image 20240528120751.png|200]]
спасибо [[Alex Kochetov]], который прочел данную лекцию
## Понятие "realtime data":
- криптовалюта, графики на биржах, продажи и покупки
- обмен сообщениями, мессенджеры
- уведомления, пуши
- игры
- мониторинг серверов и данных
- бизнес-аналитика (ключевые точки)

**WebSocket** - это протокол, который позволяется общаться с сервером двунаправлено в реальном времени.
Технически это независимый протокол, который построен поверх протокола TCP [[Основа Интернета и Браузеров]].


- W3C стандарт
- IETF в 2011 
- дуплекс realtime между клиентом и сервером
- WSS - WebSocketSecure - ssl-шифрование

## WebSocket vs HTTP [[Основа Интернета и Браузеров]]
- WS двунаправленные, HTTP - однонаправленные; 
- в WS можем слать трафик и туда и обратно, абсолютно независимо, то есть одновременно в один момент времени. В HTTP отправили и получили ответ, то есть либо клиент, либо сервер;
- в WS одно TCP соединение и небольшой overhead относительно сообщения, они абсолютно голые, например условно в HTTP может заброс весить 25 байт вместе с куками, а в WS 2 байта;
- HTTP он более продуманный, в нем есть много интересных вещей, например он предоставляет интересную семантику, GET для получения, POST для отправки, PATCH, PUT, DELETE и вокруг этого строятся всякие методологии и практики типа REST;
- HTTP хороший горизонтальный скелинг, - то есть легко добавлять новые машины, они одинаковые. С WS сложнее, там нужен брокер сверху, который будет объединять серверы и пересылать между ними сообщения. Например если геораспределенные сервера;
- в HTTP есть caching, rounting, gzip, brotli, всякие алгоритмы компрессии. В WS такого нет;
- в WS есть наличие фичи по детекту пропавших клиентов. В SSE или LP такого нет, также нет reconnection из коробки у WS, но сделать его несложно

## Alternatives
- SSE = text/event-stream + EventSource (Server Sent Events) - обычный get запрос, но contentType text/event-stream, статус код 200, но по факту он находится в *pending* состоянии и в него можно дописывать еще текст. А обрабатывается через EventSource. Ограничения: ~6 на сервер (наверно)
- Long Pooling

## Protocol: Overview
Сначала по TCP отправляется HTTP-upgrade (GET) запрос
![[Pasted image 20240528130434.png]]
То есть приходит некое рукопожатие перед использованием WS, ниже подробнее про это.
## Protocol: HandShake
Далее уже можно общаться по WS
![[Pasted image 20240528130854.png]]Как происходит HandShake?
Начинается с клиента:
```html
<script>
	new WebSocket('ws://server.example.com/chat')
</script>
```
как выглядит сам запрос:
![[Pasted image 20240528131222.png]]
 Сам запрос необычный GET-запросы, помимо обычных заголовком типа get/host/origin, здесь также есть *upgrade/connection/websocket-key/websocket-version*.
 Это специальный запрос, который браузер формирует сам, такого самостоятельно сделать не получиться.
 - *connection: upgrade* - означает, что мы запрашиваем сервер о смене протокола;
 - *upgrade: websocket* - указывает до какого мы хотим сменить протокол;
 - *websocker-version* - версия ws для использования;
 - *websocket-key* - хэш, сгенерированный на клиенте;

И так, сервер получает данный запрос и отправляет ответ:
![[Pasted image 20240528132424.png]]
Отправляет заголовок *websocket-accept*. Каким образом *key* получается *accept* и как клиент может проверить, что они совпадают:
```javascript
(async (key) => {
	const secWebSocketHeaderDemo = async (secWebSocketKey) => {
		const WS_GUID = "258EAFA5-E914-47DA-95CA-C5AB0DC85B11";
		
		const bufferToBase64 = (buffer) => 
		btoa(Array.prototype.map.call(buffer, (a) => String.fromCharCode(a).join("")));
		
		const encoder = new TextEncoder();
		const data = encoder.encode(`${secWebSocketKey}${WS_GUID}`);
		const hash = await crypto.subtle.digest("SHA-1", data);
		const secWebSocketAccept = bufferToBase64(new Uint8Array(hash));
		
		console.log( JSON.stringify({ secWebSocketKey, secWebSocketAccept }, null, 2));
	};
	await secWebSocketHeaderDemo(key);
})("my key 12345");
```
То есть проверка того, что хешики совпадают, что сервер действительно не врет и правильно сделал HandShake.

В случае успеха мы получаем ==101 Switcing Protocols==.


Также запрос может быть заблокирован, но так раньше было, сейчас уже нет:
![[Pasted image 20240528154452.png]]

## Protocol: Data transfer frames (RFC6455)
![[Pasted image 20240528155300.png]]
В WS происходит обмен некими сообщениями и в силу того, что сообщение может быть разной длины и любого вида, а в TCP есть ограничение по размеру одного пакета.
Поэтому в WS существует такая вещь как фреймы.
Они бывают **управляющими** и **фреймы с данными**. 

Фреймы с данными просто пересылают контент сообщения.
Управляющие - управляют соединением. Говорят, что хотят открыть соединение или закрыть его.

В WS есть управляющие фреймы ping и pong для проверки того, жив ли клиент. Сервер -> ping -> Клиент -> pong -> Сервер.

Каждая строка на фотке это 32 бита. F I N это один бит 0 или 1. R S V это для расширения протоколов (soap итд). Далее идет operation code, он может быть таким: ![[Pasted image 20240528155611.png]]
Далее идет бит маски, 0 или 1. Если 1 то сообщение маскируется. (проверить в squad).
Далее идет длина payload. Он может расширяться.

## Protocol: Closing Codes
![[Pasted image 20240528161056.png]]
событие close которое вызывается в браузере, это не ws и не js.