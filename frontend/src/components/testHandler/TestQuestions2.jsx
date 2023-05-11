import '../test/test.scss';
import '../learn/learnCategory.scss';
import '../card/card.scss';
import React, { useEffect, useState } from "react";
import NavbarTop from "../navbar/Navbar.jsx";
import Footer from "../footer/Footer.jsx";
import axios from 'axios'
import Spinner from "../spinner/Spinner";
import Button from 'react-bootstrap/Button';
import Stack from 'react-bootstrap/Stack';
import { useSelector } from 'react-redux'
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import styled from "styled-components"
import { useNavigate } from "react-router-dom";
import { useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import ProgressBar from 'react-bootstrap/ProgressBar';

const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`
const Options = styled.div`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  flex: 1;
  align-items: center;
  justify-content: space-around;
  margin: 10px;
`

const TestQuestions2 = ({
    currQues,
    setCurrQues,
    questions,
    options,
    correct,
    setScore,
    score,
    setQuestions,
    userId,
    exam_id
  }) => {
    const [selected, setSelected] = useState();
    const [error, setError] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { user } = useSelector((state) => state.auth)
    const headers = { 'Authorization': `Bearer ${user.token}` };
    const [questioncount, setQuestioncount] = useState(0);
    const [incorrectAnswers, setIncorrectAnswers] = useState([]);
    const [userTestId, setUserTestId] = useState('');

        const navigate = useNavigate()
      
        const params = useParams();
        const id = params;

        const handleSelect = (i) => {
          if (selected === i && selected === correct) return "select";
          else if (selected === i && selected !== correct) return "wrong";
          else if (correct && i === correct) return "select"; // Add a check for 'correct' property
        };
        
      
    
        const handleCheck = (i) => {
          setSelected(i);
          if (i === correct) {
            setScore(score + 1);
          } else {
            setIncorrectAnswers((prevAnswers) => [
              ...prevAnswers,
              {
                question: questions[currQues],
                selectedAnswer: i,
              },
            ]);
          }
          setError(false);
        };
        
      
    
        const handleNext = () => {
          if (currQues >= questions.length - 1) {
            submitTest();
          } else if (selected !== undefined) {
            setCurrQues(currQues + 1);
            setSelected(undefined);
          } else {
            toast.error("Please select an option");
          }
        };
        

      const getQuestions = async () => {
        setIsLoading(true);
        try {
          const { data } = await axios.get(
            `http://localhost:5000/api/questions?test=${id.id}`,
            {
              headers: {
                Authorization: `Bearer ${user.token}`,
              },
            }
          );
          setQuestions(data);
          setQuestioncount(data.length);
        } catch (error) {
          console.log(error);
        } finally {
          setIsLoading(false);
        }
      };

      useEffect(() => {
        getQuestions();
      }, [setQuestioncount])

      const submitTest = () => {
        const incorrectAnsweredQuestions = incorrectAnswers.map((answer) => ({
          question: answer.question._id,
          correctAnswer: answer.question.options.find((option) => option.isCorrect)?.option,
          userAnswer: options.find((option) => option.option === answer.selectedAnswer)?.option,
        }));
      
        const testData = {
          user: user._id,
          test: id.id,
          score: Math.round((score / questioncount) * 100),
          completed: true,
          incorrectAnswers: incorrectAnsweredQuestions,
        };
      
        console.log(testData);
        axios
          .post("http://localhost:5000/api/usertests/", testData, { headers })
          .then((response) => {
            console.log(response.status);
            console.log(response.data);
            setUserTestId(response.data._id);
            navigate(`/result/${response.data._id}`);
          })
          .catch((error) => {
            console.log(error);
          });

      };
      
      
      

      

    if(isLoading) {
        return <Spinner/>
    }
    return (
<>
<NavbarTop />
{questions.length > 0 ? (
  <Container>
    <Stack id="question-stack">
    <div className="container">
        <ProgressBar now={currQues + 1} label={currQues+1 + "/" + questions.length} max={questions.length}/>
        {/* <ProgressBar now={currQues + 1} label={Math.round((100 / questions.length) * [currQues+1])+ "%"} max={questions.length}/> */}
    </div>

    <div id="card-legend">
      
      <Card id="question-card">
        <Card.Body>
          <Card.Text id="card-text">
          {questions[currQues].question}
          </Card.Text>
        </Card.Body>
          <Card.Img variant="top" id="card-image" src={questions[currQues].card} alt="card"/>
      </Card>
    </div>
      <Container id="answer_container">
        <Row>
        <Col>
        <Options>
          {error && { error }}
          {questions[currQues] && questions[currQues].options && (
            questions[currQues].options.map((option) => (
              <Button
                id="answer_button"
                className={`singleOption  ${selected && handleSelect(option.option)}`}
                key={option._id}
                onClick={() => {
                  handleCheck(option.option);
                }}
                disabled={selected}
              >
                {option.option}
              </Button>
            ))
          )}
        </Options>
        </Col>
        </Row>
        <Row>
          <Col>
              <Button
                id="next_question_button"
                variant="contained"
                color="primary"
                size="large"
                style={{ width: 185 }}
                onClick={handleNext}>
                {currQues >= (questions.length - 1) ? (<span >Submit</span>) : (<span>Next Question</span>)}
              </Button>
          </Col>
        </Row>
      </Container>
    </Stack>
  </Container>

  ) : (<h3>No questions</h3>)}







<Footer/>
</>
    )

}

export default TestQuestions2;