# Express Passport

생활코딩 Express Passport

## Passport 설치

http://www.passportjs.org/ - 홈페이지

    npm install -s passport
    npm install passport-local

local 방식으로 할 때 passport-local

passport에 대한 모든 코드는 session을 사용하기때문에 app.use(session()) 밑에 작성해주어야한다.

## Authenticate

local 방식은 username과 password를 이용해 로그인 하는 것

    app.post('/login',
        passport.authenticate('local', { successRedirect: '/',
                                         failureRedirect: '/login' }));
