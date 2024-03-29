import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import Spinner from '../../../../components/spinner/Spinner';
import '../../../../components/card/card.scss'
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Stack from 'react-bootstrap/Stack';
import axios from 'axios'
import {getTests} from '../../../../features/test/testSlice'
import { getCards } from '../../../../features/card/cardSlice'
import { v4 as uuidv4 } from 'uuid';
import '../../admin.scss'

function QuestionForm() {
  const [correctOption, setCorrectOption] = useState();
  const { user } = useSelector((state) => state.auth)
  const [questionTitle, setQuestionTitle] = useState("");
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [test, setTest] = useState("");
  const { tests, isLoading, isError, message } = useSelector((state) => state.tests);
  const [card, setCard] = useState("");
  const { cards } = useSelector((state) => state.cards);
  const [dumy, setDumy] = useState(0);
  const [inputFields, setInputFields] = useState([{ id: uuidv4(), option: '' }]);
  const headers = { 'Authorization': `Bearer ${user.token}` };

    const handleAddFields = () => {
        setInputFields([...inputFields, { id: uuidv4(), option: '' }])
    }

  const handleRemoveFields = id => {
    const values = [...inputFields];
    values.splice(values.findIndex(value => value.id === id), 1);
    setInputFields(values);
}

const handleChangeInput = async (id, event) => {
  const newInputFields = await Promise.all(inputFields.map(i => {
      if (id === i.id) {
          i[event.target.name] = event.target.value
      }
      return i;
  }))
  setInputFields(newInputFields);
}


    useEffect(() => {
        if(!user){
            navigate('/sign-up')
        }

        if(user.role !== 'admin'){
            navigate('/')
        }
        dispatch(getTests())
        dispatch(getCards())
    }, [user, navigate, isError, message, dispatch])


    
    const addQuestion = async (e) => {
      e.preventDefault();

      const hasTwoOptions = inputFields.length >= 2;

      if( typeof correctOption === "undefined")
      {
        toast.error('There must be a correct option!')
      }
      if(!hasTwoOptions)
      {
        toast.error('There must be at least 2 options!')
      }

      if (questionTitle.trim().length !== 0 && test && card && hasTwoOptions && typeof correctOption !== "undefined") {
        toast.success(`Question ${questionTitle} has been created!`)
        const inputOption = await Promise.all(inputFields.map((inputF) => inputF.option))
        console.log(inputOption);
    
        const questionData = {
          test: test,
          question: questionTitle,
          card: card,
        };
        console.log(questionData)
        axios.post("https://verbum-server-kd.onrender.com/api/questions", questionData,
          { headers },).then((response) => {
            console.log(response.status);
            const data = response.data._id;
            handleOptions({ data, inputOption });
            onReset();
          });
    
      } else {
        toast.error('Please fill out all of the fields!')
      }
    }
    
    const onReset = () => {
      setTest('')
      setQuestionTitle('')
      setCard('')
      setInputFields([{ id: uuidv4(), option: '' }])
    }
    
    

      const handleOptions = ({ data, inputOption }) => {
        var questionOptions;
        var control;
        for (let i = 0; i < inputOption.length; i++) {
            var questionOptions = inputOption[i];
            if (questionOptions == correctOption) {
                control = true
            } else {
                control = false
            }
            const option = {
                options: {
                    option: questionOptions,
                    isCorrect: control
                }
            }
            console.log(option);
            axios.put("https://verbum-server-kd.onrender.com/api/questions/" + data, option ,{headers},).then((response) => {
                console.log(response.status);
                console.log(response);
            });
        }
        setDumy(dumy + 1)
    }

      const [isShown, setIsShown] = useState(false);

      const handleClick = () => {
        setIsShown(current => !current);
      };

      if(isLoading) {
        return <Spinner/>
    }

      return (
        <>
        <Container className='card-legend pt-5'>
        <Form onSubmit={addQuestion}>
          <Row>
          <Col>
            <Form.Group className="mb-3">
              <Form.Label>Question</Form.Label>
              <Form.Control 
              type='text'
              name='questionTitle'
              required
              onChange={(e) => setQuestionTitle(e.target.value)}
              placeholder="Question"
              />
            </Form.Group>

            <div className="input-group mb-3">
              <Form.Select onChange={(e)=>setTest(e.target.value)} id="test" name="cars" className="form-control select select-initialized"  value={test}>
                <option >Choose Test</option>
                {
                    tests && tests.map(test =>(
                        <option key={test._id}  value={test._id} test={test} >{test.testname}</option>
                    ))   
                }
              </Form.Select>
            </div>

            <div className="input-group mb-3">
              <Form.Select onChange={(e)=>setCard(e.target.value)} id="card" name="cars" className="form-control select select-initialized"  value={card.image}>
                <option >Choose Card</option>
                {
                  cards && cards.map(card =>(
                      <option key={card._id}  value={card.image} card={card.image} >{card.lv_word}</option>
                  ))  
                }
              </Form.Select>
            </div>
          </Col>    
          </Row>
      </Form>
      </Container>
<Container>
  <div>
    <Form.Group>
        {inputFields.map(inputField => (
        <div key={inputField.id} className="input-group mb-3" style={{ width: "650px" }} >
            <Form.Control
                name="option"
                label="option"
                value={inputField.option}
                onChange={event => handleChangeInput(inputField.id, event)}
            />
            <Button variant="danger" type="button" id="option-button" disabled={inputFields.length === 1} onClick={() => handleRemoveFields(inputField.id)}>Remove</Button>
            <Button variant="success" type="button" id="option-button" disabled={inputFields.length > 3} onClick={handleAddFields}>Add</Button>
            <input type="radio" name='control' id="option-correct" value={inputField.option} onClick={(e) => setCorrectOption(e.target.value)} />
        </div> 
    ))}
      </Form.Group>
  </div>
</Container>

<Container className='card-legend pt-5'>
      <Stack direction="horizontal" gap={3} className="pt-5 d-flex justify-content-end">
          <Button variant="success" type="submit" onClick={addQuestion}>Submit</Button>
          <div className="vr" />
          <Button variant="danger" onClick={onReset}>Reset</Button>
      </Stack>
</Container>
  </>
      );
  }
  
  export default QuestionForm;