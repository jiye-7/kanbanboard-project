import React from 'react';
import ReactDOM from 'react-dom';
import '@atlaskit/css-reset';
import { DragDropContext } from 'react-beautiful-dnd';
import initialData from './initial-data';
import Column from './column';

class App extends React.Component {
  state = initialData;

  /*
  DragDropContext 콜백 기능을 사용하여 일부 글로벌 스타일을 업데이트하는 꽤 의도된 코드 
  일반적으로 이러한 콜백에서 애플리케이션에 대한 스타일을 업데이트하지 않으며 스냅샷 값에 의존한다 */

  /*   onDragStart = () => {
    document.body.style.color = '#5e35b1';
    document.body.style.transition = 'background-color 0.3s ease';
  }; */

  /*   onDragUpdate = (update) => {
    const { destination } = update;
    const opacity = destination
      ? destination.index / Object.keys(this.state.tasks).length
      : 0;
    document.body.style.backgroundColor = `rgba(153, 141, 217, ${opacity}`;
  }; */

  // reorder our column
  onDragEnd = (result) => {
    /*     끌기가 완료되면 텍스트 색 변경
    document.body.style.color = 'inherit';
    document.body.style.backgroundColor = 'inherit'; */

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
    const column = this.state.columns[source.droppableId];

    // 업데이트 할 때 기존 상태의 변형을 방지하고, 변경 사항에 대한 새 객체를 생성하기 위해 마지막 배열의 값과 동일한 내용을 포함하는 것을 가져와서 얕은 복사를 함
    const newTaskIds = Array.from(column.taskIds);
    // 이동할 task를 이전 인덱스에서 Array의 새 인덱스로 이동해야 된다. splice: 배열의 기존 요소를 삭제 또는 교체하거나 새 요소를 추가하여 배열의 내용을 변경
    newTaskIds.splice(source.index, 1);
    // 드래그 가능한 id를 삽입: 목적지 인덱스, 0개를 지움, 드래그 할 id(task id)
    newTaskIds.splice(destination.index, 0, draggableId);

    // 새 열 생성, 이 열은 새 작업 id 배열에서 이전 열과 동일한 속성을 가진다. 새로운 칼럼이 생겼으니 state의 새로운 부분으로 본다.
    // spread syntax를 사용해서 주 객체의 이전 속성을 유지하되, 참조를 무효화
    const newColumn = {
      ...column,
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
  };

  render() {
    return (
      <DragDropContext onDragEnd={this.onDragEnd}>
        {this.state.columnOrder.map((columnId) => {
          const column = this.state.columns[columnId];
          const tasks = column.taskIds.map(
            (taskId) => this.state.tasks[taskId]
          );

          return <Column key={column.id} column={column} tasks={tasks} />;
        })}
      </DragDropContext>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('root'));
