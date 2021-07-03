import React from 'react';
import styled from 'styled-components';
import { Droppable } from 'react-beautiful-dnd';
import Task from './task';

const Container = styled.div`
  margin: 0.5rem;
  border: 1px solid #d1c4e9;
  border-radius: 0.3rem;
  background-color: #d1c4e9;
`;

const Title = styled.h3`
  padding: 0.5rem;
`;

const TaskList = styled.div`
  padding: 0.5rem;
  border-radius: 0.3rem;
  margin: 0.2rem 0.2rem;
  transition: background-color 0.3s ease;
  background-color: ${(props) =>
    props.isDraggingOver ? '#ba68c8' : '#ede7f6'};
`;

export default class Column extends React.Component {
  render() {
    return (
      <Container>
        <Title>{this.props.column.title}</Title>
        <Droppable droppableId={this.props.column.id}>
          {(provided, snapshot) => (
            <TaskList
              ref={provided.innerRef}
              {...provided.droppableProps}
              isDraggingOver={snapshot.isDraggingOver}
            >
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
