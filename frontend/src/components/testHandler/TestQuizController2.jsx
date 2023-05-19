import axios from "axios";
import { useEffect, useState } from "react";
import Quiz from "./TestQuiz2";
import { useParams } from 'react-router-dom'
import { useSelector } from "react-redux";
import NoQuestions from "../question/NoQuestions";
import Spinner from "../spinner/Spinner";

const QuizController = () => {
    const { user } = useSelector((state) => state.auth)
    const headers = { 'Authorization': `Bearer ${user.token}` };
    const [questions, setQuestions] = useState([]);
    const [score, setScore] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const params = useParams();
    const id = params;

    useEffect(() => {
        getQuestions();
    }, [])

    const getQuestions = async () => {
        const { data } = await axios.get(`https://verbum-server-kd.onrender.com/api/questions?test=${id.id}`, { headers });
        setQuestions(data);
        setIsLoading(false);
    }

    if (isLoading) {
        return (<Spinner/>)
    }
    return (
        <div>
        {questions.length > 0 ? (
            <Quiz
            questions={questions}
            score={score}
            setScore={setScore}
            setQuestions={setQuestions}
            exam_id={id}
            />
        ) : (<NoQuestions/>)}
        </div>
    );
}

export default QuizController;