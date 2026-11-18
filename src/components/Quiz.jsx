import { useState } from 'react';
import { quizQuestions } from '../data/quizQuestions.js';
import './Quiz.css';

export default function Quiz() {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [answers, setAnswers] = useState([]);

  const question = quizQuestions[current];
  const isLast = current === quizQuestions.length - 1;

  function selectOption(index) {
    if (selected !== null) return;
    setSelected(index);
    const correct = index === question.answer;
    if (correct) setScore((s) => s + 1);
    setAnswers((prev) => [...prev, { question: question.question, correct }]);
  }

  function next() {
    if (isLast) {
      setFinished(true);
      return;
    }
    setCurrent((c) => c + 1);
    setSelected(null);
  }

  function restart() {
    setCurrent(0);
    setSelected(null);
    setScore(0);
    setFinished(false);
    setAnswers([]);
  }

  if (finished) {
    const pct = Math.round((score / quizQuestions.length) * 100);
    let verdict = 'Keep revisiting the simulators above — try failing disks on each level.';
    if (pct >= 90) verdict = 'Excellent! You have a strong grasp of RAID fundamentals.';
    else if (pct >= 70) verdict = 'Good work — a couple of concepts are worth a second look.';
    else if (pct >= 40) verdict = 'Getting there — revisit the levels you got wrong below.';

    return (
      <div className="quiz quiz-results">
        <h2>Quiz complete</h2>
        <p className="score">
          You scored <strong>{score} / {quizQuestions.length}</strong> ({pct}%)
        </p>
        <p className="verdict">{verdict}</p>
        <ul className="review-list">
          {answers.map((a, i) => (
            <li key={i} className={a.correct ? 'correct' : 'incorrect'}>
              <span>{a.correct ? '✅' : '❌'}</span> {a.question}
            </li>
          ))}
        </ul>
        <button type="button" onClick={restart}>
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="quiz">
      <div className="quiz-progress">
        Question {current + 1} of {quizQuestions.length}
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${(current / quizQuestions.length) * 100}%` }} />
        </div>
      </div>

      <h2>{question.question}</h2>

      <div className="options">
        {question.options.map((option, index) => {
          let className = 'option';
          if (selected !== null) {
            if (index === question.answer) className += ' option-correct';
            else if (index === selected) className += ' option-incorrect';
          }
          return (
            <button key={option} type="button" className={className} onClick={() => selectOption(index)} disabled={selected !== null}>
              {option}
            </button>
          );
        })}
      </div>

      {selected !== null && (
        <div className={`explanation ${selected === question.answer ? 'good' : 'bad'}`}>
          <strong>{selected === question.answer ? 'Correct!' : 'Not quite.'}</strong>
          <p>{question.explanation}</p>
          <button type="button" onClick={next}>
            {isLast ? 'See my results' : 'Next question →'}
          </button>
        </div>
      )}
    </div>
  );
}
