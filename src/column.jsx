import React from 'react';
import styled from 'styled-components';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import Task from './task';

const Container = styled.div`
  margin: 0.5rem;
  border: 1px solid #d1c4e9;
  border-radius: 0.3rem;
  background-color: #d1c4e9;
  width: 300px;
  display: flex;
  flex-direction: column;
`;

const Title = styled.h3`
  padding: 0.5rem;
`;

const TaskList = styled.div`
  padding: 0.1rem;
  border-radius: 0.3rem;
  margin: 0.2rem 0.2rem;
  transition: background-color 0.3s ease;
  background-color: ${(props) =>
    props.isDraggingOver ? '#ba68c8' : '#ede7f6'};
  flex-grow: 1;
  min-height: 100px;
`;

// task를 매핑하고 task 구성 요소를 이 내부 목록 구성요소로 반환하기 위한 논리를 여기로 이동
// shouldComponentUpdate 수명 주기 방법을 추가 할 것이다.
class InnerList extends React.Component {
  shouldComponentUpdate(nextProps) {
    // 새 작업 배열이 기존 작업 배열과 참조 동일성을 공유하는 경우 렌더링 건너 뜀
    if (nextProps.tasks === this.props.tasks) {
      return false;
    }
    // array에 대한 참조가 변경된 경우 렌더링 허용
    return true;
  }

  render() {
    return this.props.tasks.map((task, index) => (
      <Task key={task.id} task={task} index={index} />
    ));
  }
}

export default class Column extends React.Component {
  render() {
    return (
      <Draggable draggableId={this.props.column.id} index={this.props.index}>
        {(provided) => (
          <Container {...provided.draggableProps} ref={provided.innerRef}>
            <Title {...provided.dragHandleProps}>
              {this.props.column.title}
            </Title>
            <Droppable
              droppableId={this.props.column.id}
              type='task'
              // isDropDisabled={this.props.isDropDisabled}
            >
              {(provided, snapshot) => (
                <TaskList
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  isDraggingOver={snapshot.isDraggingOver}
                >
                  {/* {this.props.tasks.map((task, index) => (
                    <Task key={task.id} task={task} index={index} />
                  ))} */}
                  <InnerList tasks={this.props.tasks} />
                  {provided.placeholder}
                </TaskList>
              )}
            </Droppable>
          </Container>
        )}
      </Draggable>
    );
  }
}
