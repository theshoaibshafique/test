import React from 'react';
import styled, { keyframes } from 'styled-components';

const Fill = keyframes`
  0% {
    height: 0;
  }
  100% {
    height: ${(props) => props.goal}%;    
  }
`;

const AnimatedGoal = styled.div`
  display: flex;
  flex-direction: column;
  width: 7px;
  height: 128px;
  border-radius: 8px;
  position: relative;
  background-color: #e0e0e0;
  &::before {
    position: absolute;
    content: '';
    z-index: 1;
    width: 100%;
    height: 2px;
    bottom: ${(props) => props.target || 50}%;
    left: 0px;
    background-color: #4f4f4f;
  }

  &::after {
    position: absolute;
    content: "";
    width: 100%;
    bottom: 0;
    left: 0;
    height: ${(props) => props.goal}%;
    border-bottom-left-radius: 8px;
    border-bottom-right-radius: 8px;
    border-top-left-radius: ${(props) => (props.goal === 100 ? '8px' : '0px')};
    border-top-right-radius: ${(props) => (props.goal === 100 ? '8px' : '0px')};
    background-color: #3db3e3;
    animation: ${Fill} 1s ease-in forwards;
  }
  span {
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #4F4F4F;
    font-size: 12px !important;
    content: '';
    left: -40px;
    bottom: ${(props) => props.target || 50}%;
  }
`;

/*
* @param {number} target - The target goal expected to be hit
* @param {number} goal - The value reached
*/
const Goal = ({ target, goal }) => (
  <AnimatedGoal target={target} goal={goal}>
    <span>Goal</span>
  </AnimatedGoal>
);

export default Goal;
