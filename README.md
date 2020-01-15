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
