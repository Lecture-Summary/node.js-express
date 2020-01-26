# Express Session

생활코딩 Express Session

## 설치

https://github.com/expressjs/session
https://expressjs.com/en/resources/middleware/session.html

    npm install -s express-session

## 옵션

    app.use(session({
        secret: "keyboard cat",
        resave: false,
        saveUninitialized: true
        })
    );

session 함수의 매개변수 객체의 secret 부분은 버젼관리를 할 때 따로 관리해줘야한다.

saveUninitialized : 세션이 필요하기 전까지는 세션을 구동시키지 않는다.(false일 시 무조건 구동시킨다. 서버에 큰 부담)

## 세션 저장소

세션 데이터의 저장소를 세션 저장소라고 한다.

https://www.npmjs.com/package/session-file-store

    npm install -s session-file-store
