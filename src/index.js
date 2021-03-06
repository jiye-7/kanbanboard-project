import React from 'react';
import ReactDOM from 'react-dom';
import '@atlaskit/css-reset';
import styled from 'styled-components';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import initialData from './initial-data';
import Column from './column';

const Container = styled.div`
  display: flex;
`;

class InnerList extends React.PureComponent {
  // 어떤 소품도 바뀌지 않으면 조건부로 렌더링을 차단할 수 있다.
  // 순수 구성 요소에서 확장되도록 구성 요소를 변경할 수 있습니다.
  // 순수 구성 요소는 여기에 있는 구성 요소 업데이트 확인과 동일한 작업을 수행합니다.

  /* shouldComponentUpdate(nextProps) {
    // 이 세 가지 속성 중 어느것도 드래그 도중 바뀌면 안 된다.
    if (
      nextProps.column === this.props.column &&
      nextProps.taskMap === this.props.taskMap &&
      nextProps.index === this.props.index
    ) {
      return false;
    }
    return true;
  } */

  render() {
    const { column, taskMap, index } = this.props;
    const tasks = column.taskIds.map((taskId) => taskMap[taskId]);

    return <Column column={column} tasks={tasks} index={index} />;
  }
}

class App extends React.Component {
  state = initialData;

  // 끌기 시작하는 열의 인덱스를 캡쳐하기 위해 onDragStart를 만든다.
  /* onDragStart = (start) => {
    const homeIndex = this.state.columnOrder.indexOf(start.source.droppableId);

    this.setState({
      homeIndex,
    });
  }; */

  // reorder our column
  onDragEnd = (result) => {
    // 인덱스를 구성 요소 상태로 기록, 여기 있는 동안 끌기가 완료되면 이 인덱스를 지운다. (이전 컬럼으로 돌아갈 수 없음)
    /* this.setState({
      homeIndex: null,
    }); */

    // 사용자가 column을 끌었는지, task를 끌었는지 판별하기 위해 type 추가
    const { destination, source, draggableId, type } = result;

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

    // 열에 대한 재정렬을 처리하기 위한 논리를 추가

    if (type === 'column') {
      // 이전 열 순서 배열과 동일한 값을 갖는 새 열순서 array를 생성한다.
      const newColumnOrder = Array.from(this.state.columnOrder);
      // 기존 열 id를 원래 인덱스에서 제거하고 열 id를 새 위치에 삽입한다.
      newColumnOrder.splice(source.index, 1);
      newColumnOrder.splice(destination.index, 0, draggableId);

      // 이전 스타일 객체와 동일하지만 새로운 열 순서 배열로 새로운 스타일 객체를 만듦
      // 열 순서 변경은 현재 지속되고 있지만,
      const newState = {
        ...this.state,
        columnOrder: newColumnOrder,
      };
      this.setState(newState);
      return;
    }

    // 열에 대한 task id 배열의 순서를 다시 지정한다. state에서 column을 읽어와서 드롭 파일 id를 사용해서 state에서의 열을 조회
    const home = this.state.columns[source.droppableId];
    // 끝나는 열 추가
    const foreign = this.state.columns[destination.droppableId];

    // 단일 열 내에서 재 정렬
    if (home === foreign) {
      // 업데이트 할 때 기존 상태의 변형을 방지하고, 변경 사항에 대한 새 객체를 생성하기 위해 마지막 배열의 값과 동일한 내용을 포함하는 것을 가져와서 얕은 복사를 함
      const newTaskIds = Array.from(home.taskIds);
      // 이동할 task를 이전 인덱스에서 Array의 새 인덱스로 이동해야 된다. splice: 배열의 기존 요소를 삭제 또는 교체하거나 새 요소를 추가하여 배열의 내용을 변경
      newTaskIds.splice(source.index, 1); // 단일 열 내에서 재 정렬
      // 드래그 가능한 id를 삽입: 목적지 인덱스, 0개를 지움, 드래그 할 id(task id)
      newTaskIds.splice(destination.index, 0, draggableId); // 단일 열 내에서 재 정렬

      // 새 열 생성, 이 열은 새 작업 id 배열에서 이전 열과 동일한 속성을 가진다. 새로운 칼럼이 생겼으니 state의 새로운 부분으로 본다.
      // spread syntax를 사용해서 주 객체의 이전 속성을 유지하되, 참조를 무효화
      const newHome = {
        ...home,
        taskIds: newTaskIds,
      };

      const newState = {
        ...this.state,
        columns: {
          ...this.state.columns,
          [newHome.id]: newHome,
        },
      };

      this.setState(newState);
      return;
    }

    // Moving from one list to another

    // 이전 array와 동일한 id를 포함하는 새 시작 Task id array를 생성
    const homeTaskIds = Array.from(home.taskIds);
    // array에서 끌어온 작업 id를 제거
    homeTaskIds.splice(source.index, 1);
    // 이전 열과 동일한 속성을 포함하지만 새 시작 태스크 id array가 없는 새 시작 열을 생성
    const newHome = {
      ...home,
      taskIds: homeTaskIds,
    };

    // 마지막 완료 열과 동일한 작업 id를 포함하는 완료 작업 id에 대한 새 array 생성
    const foreignTaskIds = Array.from(foreign.taskIds);
    // 정의 인덱스에 드래그 가능한 id를 삽입하기 위해 splice를 사용
    foreignTaskIds.splice(destination.index, 0, draggableId);
    // 다시 새 열을 만든다. 해당 열에 대한 새 작업 id가 있는 완료 열
    const newForeign = {
      ...foreign,
      taskIds: foreignTaskIds,
    };

    // 이전 상태 객체와 속성이 동일한 새 상태 객체를 생성하지만 업데이트 된 작업 id가 포함된 열을 포함하도록 열의 map을 업데이트
    const newState = {
      ...this.state,
      columns: {
        ...this.state.columns,
        [newHome.id]: newHome,
        [newForeign.id]: newForeign,
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
        <Droppable
          droppableId='all-columns'
          direction='horizontal'
          type='column'
        >
          {(provided) => (
            <Container {...provided.droppableProps} ref={provided.innerRef}>
              {this.state.columnOrder.map((columnId, index) => {
                const column = this.state.columns[columnId];
                /*
                컬럼 구성요소와 마찬가지로 드래그 도중 드롭할 수 있는 컨테이너의 하위 항목이 렌더링 되지 않도록 하기 위해 이 코드는 지운다.
                 const tasks = column.taskIds.map(
                  (taskId) => this.state.tasks[taskId]
                ); */

                // 작업을 작업관리에서 진행 중으로 이동할 수 있지만 더 이상 진행 중인 작업에서 작업관리로 이동할 수 없다.
                // 작업을 진행 중에서 완료로만 이동할 수 있다.
                // 이걸 밑에 Column에 전달한다.
                // const isDropDisabled = index < this.state.homeIndex;

                return (
                  <InnerList
                    key={column.id}
                    column={column}
                    taskMap={this.state.tasks}
                    index={index}
                    // isDropDisabled={isDropDisabled}
                  />
                );
              })}
              {provided.placeholder}
            </Container>
          )}
        </Droppable>
      </DragDropContext>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('root'));
