import { useEffect, useState, memo } from 'react';
import classnames from 'classnames';
import './App.scss';
import exam from './exam.json';
import classNames from 'classnames';

const Answer = ({ text, onClick, selected, valid }) => {
  return (
    <div
      className={classnames('answer', {
        selected,
        valid,
        invalid: !valid
      })}
      onClick={onClick}>
      {text}
    </div>
  );
};

const Question = ({ text }) => <div className='question'>{text}</div>;

const pickQuestion = (questions, stats) => {
  const index = Math.floor(Math.random() * questions.length);
  return questions[index];
};

const initialState = {
  status: 'init',
  currentQuestion: null,
  currentQuestionIndex: null,
  selectedAnswer: null,
  showRight: false,
  showControls: false,
  stats: { answers: [], rightAnswers: 0, totalAnswers: 0, removedQuestions: 0 }
};

const App = () => {
  const [state, setState] = useState(initialState);

  useEffect(() => {
    // load local stats
    //const state = localStorage.getItem('state');
    console.log('loading state from localstorage');
    setState(s => ({ ...s, status: 'loaded' }));
  }, []);

  useEffect(() => {
    if (state.status === 'loaded') {
      setState(s => ({
        ...s,
        currentQuestion: pickQuestion(exam.questions),
        status: 'ready'
      }));
    } else if (state.status === 'wrong') {
      // calculate stats here
      // if {state}
      setTimeout(
        () => setState(s => ({ ...s, status: 'showRight', showRight: true })),
        500
      );
    } else if (state.status === 'showRight' || state.status === 'right') {
      // calculate stats here
      // if {state}
      setTimeout(
        () => setState(s => ({ ...s, status: 'waitingForClick' })),
        500
      );
    } else if (state.status === 'goingNext') {
      setTimeout(
        () =>
          setState(s => ({
            ...s,
            showRight: false,
            selectedAnswer: null,
            currentQuestion: pickQuestion(exam.questions),
            status: 'ready'
          })),
        500
      );
    }
  }, [state.status]);

  const handleAnswer = i => () => {
    if (state.status === 'ready')
      state.currentQuestion.answers[i].valid
        ? setState(s => ({ ...s, selectedAnswer: i, status: 'right' }))
        : setState(s => ({ ...s, selectedAnswer: i, status: 'wrong' }));
  };

  const handleAppClick = () => {
    if (state.status === 'waitingForClick') {
      setState(s => ({ ...s, status: 'goingNext' }));
    }
  };

  const handleShowAllClick = () => {
    //if (state.status === 'waitingForClick') {
    setState(s => ({ ...s, showRight: true, status: 'showAll' }));
    //}
  };

  const renderQuestion = () =>
    state.status === 'ready' ||
    state.status === 'wrong' ||
    state.status === 'right' ||
    state.status === 'showRight' ||
    state.status === 'waitingForClick' ||
    state.status === 'goingNext' ? (
      <div
        className={classNames('question-wrapper', {
          'going-next': state.status === 'goingNext'
        })}>
        <Question text={state.currentQuestion.question} />
        {state.currentQuestion.answers.map((e, i) => (
          <Answer
            key={i}
            text={e.text}
            onClick={handleAnswer(i)}
            selected={state.selectedAnswer === i || state.showRight}
            valid={e.valid}
          />
        ))}
      </div>
    ) : null;

  const renderAll = () =>
    state.status === 'showAll' ? (
      <>
        {exam.questions.map((q, iq) => (
          <div key={iq} className='question-wrapper'>
            <Question key={iq} text={q.question} />
            {q.answers.map((e, i) => (
              <Answer
                key={`${iq}-${i}`}
                text={e.text}
                selected={e.valid}
                valid={e.valid}
              />
            ))}
          </div>
        ))}
      </>
    ) : null;

  return (
    <div
      className={classNames('app', {
        'waiting-for-click': state.status === 'waitingForClick'
      })}
      onClick={handleAppClick}>
      <div className='status-bar'>
        <div className='button' onClick={handleShowAllClick}>
          show all
        </div>
        <div className='question-counter'>26/30</div>
      </div>
      {renderQuestion()}
      {state.showControls && (
        <div className='controls'>
          <div className='button'>&lt;</div>
          <div className='button'>&gt;</div>
        </div>
      )}
      {renderAll()}
    </div>
  );
};

export default App;
