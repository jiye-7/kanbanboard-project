import React from 'react'
import styled from 'styled-components';

const Container = styled.div`
  border: 1px solid #90caf9;
  background-color: #90caf9;
  border-radius: 0.3rem;
  padding: 0.5rem;
  margin: 0.5rem;
  color: #01579b;
  font-weight: bold;
`;

export default class Task extends React.Component {
  render() {
    return <Container>{this.props.task.content}</Container>;
  }
}
