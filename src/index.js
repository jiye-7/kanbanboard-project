import React from 'react';
import ReactDOM from 'react-dom';
import '@atlaskit/css-reset';
import styled from 'styled-components';
import { DragDropContext } from 'react-beautiful-dnd';
import initialData from './initial-data';
import Column from './column';

const Container = styled.div`
  display: flex;
`;

class App extends React.Component {
  state = initialData;

  // 끌기 시작하는 열의 인덱스를 캡쳐하기 위해 onDragStart를 만든다.
  onDragStart = (start) => {
    const homeIndex = this.state.columnOrder.indexOf(start.source.droppableId);

    this.setState({
      homeIndex,
    });
  };

  // reorder our column
  onDragEnd = (result) => {
    // 인덱스를 구성 요소 상태로 기록, 여기 있는 동안 끌기가 완료되면 이 인덱스를 지운다. (이전 컬럼으로 돌아갈 수 없음)
    this.setState({
      homeIndex: null,
    });

    const { destination, source, draggableId } = result;

    // 드래그를 했을 때, 결과가 없다면 아무것도 하지 않는다.
    if (!destination) {
      return;
    }

    // 드래그한 위치가 변경되었는 지 확인, 드래그하는 대상 id가 소스와 동일한지? 인덱스가 동일한지 확인
    // 두 가지가 사실이면 사용자가 항목을 다시 시작된 위치를 끌어다 놓기 때문에 아무것도 하지 않는다.
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    // 열에 대한 task id 배열의 순서를 다시 지정한다. state에서 column을 읽어와서 드롭 파일 id를 사용해서 state에서의 열을 조회
    const start = this.state.columns[source.droppableId];
    // 끝나는 열 추가
    const finish = this.state.columns[destination.droppableId];

    // 단일 열 내에서 재 정렬
    if (start === finish) {
      // 업데이트 할 때 기존 상태의 변형을 방지하고, 변경 사항에 대한 새 객체를 생성하기 위해 마지막 배열의 값과 동일한 내용을 포함하는 것을 가져와서 얕은 복사를 함
      const newTaskIds = Array.from(start.taskIds);
      // 이동할 task를 이전 인덱스에서 Array의 새 인덱스로 이동해야 된다. splice: 배열의 기존 요소를 삭제 또는 교체하거나 새 요소를 추가하여 배열의 내용을 변경
      newTaskIds.splice(source.index, 1); // 단일 열 내에서 재 정렬
      // 드래그 가능한 id를 삽입: 목적지 인덱스, 0개를 지움, 드래그 할 id(task id)
      newTaskIds.splice(destination.index, 0, draggableId); // 단일 열 내에서 재 정렬

      // 새 열 생성, 이 열은 새 작업 id 배열에서 이전 열과 동일한 속성을 가진다. 새로운 칼럼이 생겼으니 state의 새로운 부분으로 본다.
      // spread syntax를 사용해서 주 객체의 이전 속성을 유지하되, 참조를 무효화
      const newColumn = {
        ...start,
        taskIds: newTaskIds,
      };

      const newState = {
        ...this.state,
        columns: {
          ...this.state.columns,
          [newColumn.id]: newColumn,
        },
      };

      this.setState(newState);
      return;
    }

    // Moving from one list to another

    // 이전 array와 동일한 id를 포함하는 새 시작 Task id array를 생성
    const startTaskIds = Array.from(start.taskIds);
    // array에서 끌어온 작업 id를 제거
    startTaskIds.splice(source.index, 1);
    // 이전 열과 동일한 속성을 포함하지만 새 시작 태스크 id array가 없는 새 시작 열을 생성
    const newStart = {
      ...start,
      taskIds: startTaskIds,
    };

    // 마지막 완료 열과 동일한 작업 id를 포함하는 완료 작업 id에 대한 새 array 생성
    const finishTaskIds = Array.from(finish.taskIds);
    // 정의 인덱스에 드래그 가능한 id를 삽입하기 위해 splice를 사용
    finishTaskIds.splice(destination.index, 0, draggableId);
    // 다시 새 열을 만든다. 해당 열에 대한 새 작업 id가 있는 완료 열
    const newFinish = {
      ...finish,
      taskIds: finishTaskIds,
    };

    // 이전 상태 객체와 속성이 동일한 새 상태 객체를 생성하지만 업데이트 된 작업 id가 포함된 열을 포함하도록 열의 map을 업데이트
    const newState = {
      ...this.state,
      columns: {
        ...this.state.columns,
        [newStart.id]: newStart,
        [newFinish.id]: newFinish,
      },
    };
    this.setState(newState);
  };

  render() {
    return (
      <DragDropContext
        onDragStart={this.onDragStart}
        onDragEnd={this.onDragEnd}
      >
        <Container>
          {this.state.columnOrder.map((columnId, index) => {
            const column = this.state.columns[columnId];
            const tasks = column.taskIds.map(
              (taskId) => this.state.tasks[taskId]
            );

            const isDropDisabled = index < this.state.homeIndex;

            return (
              <Column
                key={column.id}
                column={column}
                tasks={tasks}
                isDropDisabled={isDropDisabled}
              />
            );
          })}
        </Container>
      </DragDropContext>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('root'));
