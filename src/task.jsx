import React from 'react';
import styled from 'styled-components';
import { Draggable } from 'react-beautiful-dnd';

const Container = styled.div`
  border: 1px solid #9575cd;
  border-radius: 0.3rem;
  padding: 0.5rem;
  margin: 0.5rem;
  font-weight: bold;
  color: ${(props) => (props.isDragging ? '#fff' : '#5e35b1')};
  background-color: ${(props) => (props.isDragging ? '#4a148c' : '#9575cd')};
  display: flex;
`;

const Handle = styled.div`
  width: 1.3rem;
  height: 1.3rem;
  background-color: #ef9a9a;
  border-radius: 4px;
  margin-right: 0.7rem;
`;

export default class Task extends React.Component {
  render() {
    return (
      <Draggable draggableId={this.props.task.id} index={this.props.index}>
        {(provided, snapshot) => (
          <Container
            {...provided.draggableProps}
            ref={provided.innerRef}
            isDragging={snapshot.isDragging}
          >
            <Handle {...provided.dragHandleProps} />
            {this.props.task.content}
          </Container>
        )}
      </Draggable>
    );
  }
}
