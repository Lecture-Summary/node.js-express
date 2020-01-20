# express

생활코딩 express

## 모듈 설치

    npm install express --save

https://expressjs.com/ko/

## route, routing

방향을 잡는 것, 즉 사용자들의 path마다 적당한 응답을 해주는 것

https://expressjs.com/ko/guide/routing.html

    app.get("/page/:pageId", (request, response) => {
        response.send(request.params);
    });

request.params는 page/CSS 로 접속 할 경우 밑과 같이 나타난다.

    {
        "pageId": "CSS"
    }

## express 문법

    response.writeHead(200);
    response.end(html);

    response.send(html)

express에서는 send로 한번에 처리 가능하다.

## get, post

    app.get('path', callback());
    app.post('path', callback());

get 방식과 post 방식

## express에서의 redirect

    response.redirect("/");

## 미들웨어

https://expressjs.com/ko/resources/middleware.html

http://expressjs.com/en/resources/middleware/body-parser.html

    npm install --save body-parser

    app.use(bodyParser.urlencoded({ extended: false }));

main.js 가 실행될 때마다 위 코드에 의해서 만들어진 미들웨어가 실행된다.

    const post = request.body;

body-parser 를 이용하여 post된 데이터를 쉽게 받을 수 있다.

    const compression = require('compression');
    app.use(compression());

데이터를 압축하는 미들웨어

## 미들웨어 만들기

    app.get('*', (request, response, next) => {

get 방식으로 들어오는 모든 데이터에 대해 실행한다.

## 정적인 파일의 서비스

https://expressjs.com/en/starter/static-files.html

    app.use(express.static('public'));

public 안에서 static 파일을 찾겠다는 뜻

## 에러처리

https://expressjs.com/ko/starter/faq.html

    app.use((req, res, next) => {
        res.status(404).send("Sorry cant find that!");
    });

http://expressjs.com/en/guide/error-handling.html
