import React from 'react';
import styled from 'styled-components';
import { Draggable } from 'react-beautiful-dnd';

const Container = styled.div`
  border: 1px solid #9575cd;
  border-radius: 0.3rem;
  padding: 0.5rem;
  margin: 0.5rem;
  color: #5e35b1;
  font-weight: bold;
  background-color: ${(props) => (props.isDragging ? '#9fa8da' : '#9575cd')};
`;

export default class Task extends React.Component {
  render() {
    return (
      <Draggable draggableId={this.props.task.id} index={this.props.index}>
        {(provided, snapshot) => (
          <Container
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            ref={provided.innerRef}
            isDragging={snapshot.isDragging}
          >
            {this.props.task.content}
          </Container>
        )}
      </Draggable>
    );
  }
}
