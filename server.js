// server.js
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
const PORT = 3000;

// MongoDB 연결
mongoose
  .connect('mongodb://localhost:27017/my_database', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('MongoDB 연결 성공'))
  .catch((error) => console.error('MongoDB 연결 실패:', error));

// 사용자 스키마와 모델 정의
const userSchema = new mongoose.Schema({
  class_number: String,
  name: String,
});

const User = mongoose.model('User', userSchema);

// 미들웨어 설정
app.use(bodyParser.json());
app.use(express.static(__dirname));

// 유저 존재 여부 확인 엔드포인트
app.post('/checkUser', (req, res) => {
  const { class_number, name } = req.body;

  User.findOne({ class_number: class_number, name: name })
    .then((user) => {
      if (user) {
        res.json({ exists: true });
      } else {
        res.json({ exists: false });
      }
    })
    .catch((error) => res.status(500).json({ error: '서버 오류' }));
});

// 새 유저 추가 엔드포인트
app.post('/addUser', (req, res) => {
  const { class_number, name } = req.body;

  const newUser = new User({ class_number, name });
  newUser
    .save()
    .then(() => res.json({ success: true }))
    .catch((error) => res.status(500).json({ error: '유저 추가 오류' }));
});

// 서버 시작
app.listen(PORT, () => {
  console.log(`서버가 http://localhost:${PORT}에서 실행 중입니다.`);
});
