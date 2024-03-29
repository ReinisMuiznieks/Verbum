import NavbarTop from "../../components/navbar/Navbar.jsx";
import DisplayCategories from "../../components/learn/DisplayLearnCategories";
import './learn.scss';
import Container from 'react-bootstrap/Container';
import React, { useEffect, useState } from "react";
import axios from 'axios'
import { useSelector } from 'react-redux';
import { buildStyles } from 'react-circular-progressbar';
import { CircularProgressbarWithChildren } from 'react-circular-progressbar';

const Learn = () => {
    const { user } = useSelector((state) => state.auth)
    const [userProgress, setUserProgress] = useState(0);
    const [totalCards, setTotalCards] = useState(0);
    const headers = { 'Authorization': `Bearer ${user.token}` };

    useEffect(() => {
        getCardCount();
        getUserProgressCount();
        }, [])
      
        const getCardCount = async () => {
      
            axios.get('https://verbum-server-kd.onrender.com/api/cards',{headers})
            .then(response => {
              const cards = response.data;
              setTotalCards(cards.length);
            })
            .catch(error => {
              console.error('Error getting cards:', error);
            });
        }

        const getUserProgressCount = async () => {       
            axios.get('https://verbum-server-kd.onrender.com/api/userlearn/all',{headers})
              .then(response => {
                const userLearnData = response.data;
                const filteredData = userLearnData.filter(item => item.user === user._id);
                const progressSum = filteredData.reduce((sum, item) => sum + item.progress, 0);
                setUserProgress(progressSum);
              })
              .catch(error => {
                console.error('Error getting user learn data:', error);
              });
            
        }

    return (
<>
<NavbarTop />
    <Container>
        <div id="learn-page-container">
            <div>
                <p id="user-name">Hi, {user.name}!</p>
                <p id="user-progress">Your Progress</p>
            </div>
            <div className="learn-progress-bar-container">
                <CircularProgressbarWithChildren 
                value={userProgress} 
                maxValue={totalCards} 
                className="learn-progress-bar"                           
                styles={buildStyles({
                textColor: "#7678d2",
                pathColor: "#95b8fe",
                trailColor: "white"
                })}>

                <div id="learn-progress-text">
                <p>{`${userProgress}/${totalCards}`}</p>
                </div>
                <p id="learn-progress-text-completed">CARDS</p>
                </CircularProgressbarWithChildren>
            </div>
        </div>

        <div className="item-container">
            <DisplayCategories/>
        </div>
        
    </Container>
</>
    )
}

export default Learn;
