import React from 'react';
import styled from 'styled-components';
import { Droppable } from 'react-beautiful-dnd';
import Task from './task';

const Container = styled.div`
  margin: 0.5rem;
  border: 1px solid #e3f2fd;
  border-radius: 0.3rem;
  background-color: #e3f2fd;
`;

const Title = styled.h3`
  padding: 0.5rem;
`;

const TaskList = styled.div`
  padding: 0.5rem;
  background-color: #bbdefb;
  border-radius: 0.3rem;
  margin: 0.2rem 0.2rem;
`;

export default class Column extends React.Component {
  render() {
    return (
      <Container>
        <Title>{this.props.column.title}</Title>
        <Droppable droppableId={this.props.column.id}>
          {(provided) => (
            <TaskList ref={provided.innerRef} {...provided.droppableProps}>
              {this.props.tasks.map((task, index) => (
                <Task key={task.id} task={task} index={index} />
              ))}
              {provided.placeholder}
            </TaskList>
          )}
        </Droppable>
      </Container>
    );
  }
}
