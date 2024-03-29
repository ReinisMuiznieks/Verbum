import axios from "axios";
import { useEffect, useState } from "react";
import Test from "./Test";
import { useParams } from 'react-router-dom'
import { useSelector } from "react-redux";
import NoQuestions from "../question/NoQuestions";
import Spinner from "../spinner/Spinner";

const TestController = () => {
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

    // atgriež jautājumus attiecīgajam testam no datu bāzes
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
        {/* ja ir vārdu jautājumi tad padod mainīgos uz Test komponentu */}
        {questions.length > 0 ? (
            <Test
            questions={questions}
            score={score}
            setScore={setScore}
            setQuestions={setQuestions}
            exam_id={id}
            />
        // citādi atgriež NoQuestions komponentu
        ) : (<NoQuestions/>)}
        </div>
    );
}

export default TestController;