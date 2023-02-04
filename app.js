let schReg = document.querySelector('.schReg');
let stdReg = document.querySelector('.stdReg');
let stdLog = document.querySelector('.stdLog');
let schForm = document.querySelector('.schForm');
let stdForm = document.querySelector('.stdForm');
let logForm = document.querySelector('.logForm');
let allForm = document.querySelectorAll('.regForm');
let formClasses = ['logForm', 'schForm', 'stdForm'];

const resetClassNames = (e) => {
  e.preventDefault();
  for (let index = 0; index < allForm.length; index++) {
    const element = allForm[index];
    element.className = 'regForm ' + formClasses[index];
  }
};
if (schReg != undefined) {
  schReg.onclick = (e) => {
    resetClassNames(e);
    schForm.classList.toggle('active');
  };

  stdReg.onclick = (e) => {
    resetClassNames(e);
    stdForm.classList.toggle('active');
  };

  stdLog.onclick = (e) => {
    resetClassNames(e);
    logForm.classList.toggle('active');
  };

  // binding Login form
  logForm.onsubmit = (e) => {
    e.preventDefault();
    let email = document.getElementById('email').value.toLowerCase();
    psw = document.getElementById('psw').value;
    // console.log({ email, psw });
    let allStudents;
    if (localStorage.getItem('allStudents') == undefined) {
      alert('Sorry, we do not have a record for you');
    } else {
      allStudents = JSON.parse(localStorage.getItem('allStudents'));
      let found = allStudents.filter(
        (student) => student.stdEmail == email && student.pNumber == psw
      );
      console.log({ found });
      if (found.length > 0) {
        alert(`Welcome back ${found[0].stdName}. Please wait...`);
        window.setTimeout(() => {
          window.location.href = 'quizQuestion.html';
        }, 1500);
      } else {
        alert('Invalid email and password combination.');
      }
    }
  };

  // Binding School form
  if (schReg != undefined) {
    schForm.onsubmit = (e) => {
      e.preventDefault();
      let schName = document.getElementById('schName').value,
        email = document.getElementById('schEmail').value,
        schAddress = document.getElementById('schAddress').value,
        schPhone = document.getElementById('schPhone').value;

      let newSchool = { id: Date.now(), schName, email, schAddress, schPhone };
      console.log({ newSchool });
      let allSchools;
      if (localStorage.getItem('allSchools') == undefined) allSchools = [];
      else allSchools = JSON.parse(localStorage.getItem('allSchools'));
      console.log({ allSchools });
      let updatedSchool = [newSchool, ...allSchools];
      console.log({ updatedSchool });
      localStorage.setItem('allSchools', JSON.stringify(updatedSchool));
      loadSchools();
    };
    // Binding Student form
    stdForm.onsubmit = (e) => {
      e.preventDefault();
      let stdName = document.getElementById('stdName').value,
        stdEmail = document.getElementById('stdEmail').value.toLowerCase(),
        stdAddress = document.getElementById('stdAddress').value,
        schoolId = document.getElementById('selectedSch').value; //7773457638745
      let schoolName = JSON.parse(localStorage.getItem('allSchools')).filter(
        (el) => el.id == schoolId
      )[0].schName;
      let pNumber = document.getElementById('pNumber').value;
      let newStudent = {
        id: Date.now(),
        stdName,
        stdEmail,
        stdAddress,
        schoolName,
        schoolId,
        pNumber,
      };
      console.log({ newStudent });
      let allStudents;
      if (localStorage.getItem('allStudents') == undefined) allStudents = [];
      else allStudents = JSON.parse(localStorage.getItem('allStudents'));
      console.log({ allStudents });
      let updatedStudents = [newStudent, ...allStudents];
      console.log({ updatedStudents });
      localStorage.setItem('allStudents', JSON.stringify(updatedStudents));
    };

    // Loading all Schools in the Student Registration Form
    function loadSchools() {
      let allSchools,
        selectedSch = document.querySelector('#selectedSch');
      selectedSch.innerHTML = '<option > Select School</option>';
      if (localStorage.getItem('allSchools') == undefined) allSchools = [];
      else allSchools = JSON.parse(localStorage.getItem('allSchools'));
      allSchools.forEach((school) => {
        selectedSch.innerHTML += `<option value="${school.id}">${school.schName}</option>`;
      });
    }
  }
  loadSchools();
}

// QUIZ
// CREATE A QUIZ CLASS
class Quiz {
  constructor(questions) {
    this.score = 0;
    this.questions = questions;
    this.questionIndex = 0;
  }

  getQuestionIndex() {
    return this.questions[this.questionIndex];
  }

  guess(answer) {
    if (this.getQuestionIndex().isCorrectAnswer(answer)) {
      this.score++;
    }
    this.questionIndex++;
  }

  isEnded() {
    return this.questionIndex === this.questions.length;
  }
}

// CREATING QUESTION CLASS
class Question {
  constructor(text, choices, answer) {
    this.text = text;
    this.choices = choices;
    this.answer = answer;
  }

  isCorrectAnswer(choice) {
    return this.answer === choice;
  }
}

// display question
function displayQuestion() {
  if (quiz.isEnded()) {
    showScores();
  } else {
    // show question/next question
    let questionElement = document.getElementById('question');
    questionElement.innerHTML = quiz.getQuestionIndex().text;

    // show options
    let choices = quiz.getQuestionIndex().choices;
    for (let i = 0; i < choices.length; i++) {
      let choiceElement = document.getElementById('choice' + i);
      choiceElement.innerHTML = choices[i];
      guess('btn' + i, choices[i]);
    }

    showProgress();
  }
}

// Guess Function
function guess(id, guess) {
  let button = document.getElementById(id);
  button.onclick = function () {
    quiz.guess(guess);
    displayQuestion();
  };
}

// Show quiz progress
function showProgress() {
  let currentQuestionNumber = quiz.questionIndex + 1;
  let progressElement = document.getElementById('progress');
  progressElement.innerHTML = `Question ${currentQuestionNumber} of ${quiz.questions.length}
  `;
}

// SHOW SCORE
function showScores() {
  // const stdName = document.getElementById('stdName');
  let quizEndHTML = `
    <h1>Quiz Completed</h1>
    <h2 id="score">You Scored: ${quiz.score + '0%'} of ${
    quiz.questions.length + '0%'
  }</h2> 
    <div class="quiz-repeat">
      <a href="home.html">CLICK TO RETURN HOME</a>
    </div>
  `;
  let quizElement = document.getElementById('quiz');
  quizElement.innerHTML = quizEndHTML;
}

// CREATE QUIZ QUESTION

let questions = [
  new Question(
    'How many ethnic groups do we have in Nigeria?',
    [
      '150 ethnic groups',
      '250 ethnic groups',
      '255 ethnic groups',
      '350 ethnic groups',
    ],
    '250 ethnic groups'
  ),
  new Question(
    'when did the Federal Military Government abolish the four regions?',
    ['1964', '1965', '1966', '1967'],
    '1966'
  ),
  new Question(
    'In Nigeria, democracy is now celebrated on',
    ['May 28', 'June 12', 'Oct 1', 'Dec 25'],
    'June 12'
  ),
  new Question(
    'Nigeria Inspector General of Poliec is?',
    ['Adamu Mohammed', 'Adama Mohammed', 'Ademu Mohammed', 'Adamu Muhammed'],
    'Adamu Mohammed'
  ),
  new Question(
    'Who was the first writer of English Dictionary in the world?',
    [
      'Mr. Samuel Johnson',
      'Mr. Johnson Samson',
      'Mrs John Samuel',
      'Mr Samuel Clark',
    ],
    'Mr. Samuel Johnson'
  ),
  new Question(
    'The separation of powers simply means',
    ['Balancing', 'Equality', 'Checks and Balances', 'Checks'],
    'Checks and Balances'
  ),
  new Question(
    'Who created the Nigerian Council?',
    [
      'Frederick Lugerd',
      'Frederick Lugard',
      'Fredirick Lugard',
      'Fredereck Lugard',
    ],
    'Frederick Lugard'
  ),
  new Question(
    'Which countinent is the smallest in the world?',
    ['Asia', 'Ghana', 'Australia', 'Europe'],
    'Australia'
  ),
  new Question(
    'Who was the first senate president of Nigeria?',
    [
      'Mr. Kenneth Nnamdi',
      'Dr. Nnamdi Azikiwe',
      'Gen Badamasi Babagida',
      'Sanusi Sanusi',
    ],
    'Dr. Nnamdi Azikiwe'
  ),
  new Question(
    'When was paper currency introduced in Nigeria?',
    ['1960', '1980', '1918', '1914'],
    '1918'
  ),
];

let quiz = new Quiz(questions);

// display questions
displayQuestion();

// ADD A COUNTDOWN
const time = 2;
const quizTimeInMinutes = time * 60 * 60;
quizTime = quizTimeInMinutes / 60;

let counts = document.getElementById('count-down');

function startCountDown() {
  let quizTimer = setInterval(function () {
    if (quizTime <= 0) {
      clearInterval(quizTimer);
      showScores();
    } else {
      quizTime--;
      let sec = Math.floor(quizTime % 60);
      let min = Math.floor(quizTime / 60) % 60;
      counts.innerHTML = `REMAINING TIME : ${min} : ${sec}`;
    }
  }, 1000);
}

startCountDown();
