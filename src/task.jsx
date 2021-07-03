import React from 'react';
import styled from 'styled-components';
import { Draggable } from 'react-beautiful-dnd';

const Container = styled.div`
  border-radius: 0.3rem;
  padding: 0.5rem;
  margin: 0.5rem;
  font-weight: bold;
  color: ${(props) => (props.isDragging ? '#fff' : '#5e35b1')};
  background-color: ${(props) =>
    /* props.isDragDisabled
      ? '#ffebee'
      :  */ props.isDragging ? '#4a148c' : '#9575cd'};
  display: flex;
`;

/* const Handle = styled.div`
  width: 1.3rem;
  height: 1.3rem;
  background-color: #ef9a9a;
  border-radius: 4px;
  margin-right: 0.7rem;
`; */

export default class Task extends React.Component {
  render() {
    // const isDragDisabled = this.props.task.id === 'task-1';

    return (
      <Draggable
        draggableId={this.props.task.id}
        index={this.props.index}
        // isDragDisabled={isDragDisabled}
      >
        {(provided, snapshot) => (
          <Container
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            ref={provided.innerRef}
            isDragging={snapshot.isDragging}
            // isDragDisabled={isDragDisabled}
          >
            {/* <Handle /> */}
            {this.props.task.content}
          </Container>
        )}
      </Draggable>
    );
  }
}
