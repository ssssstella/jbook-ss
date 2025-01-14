import { ActionType } from '../action-types';
import { Action } from '../actions';
import { Cell } from '../cell';
import { produce } from 'immer';

interface CellsState {
  loading: boolean;
  error: string | null;
  order: string[];
  data: {
    [key: string]: Cell;
  };
}

const randomId = () => {
  return Math.random().toString(36).substring(2, 7);
}

const initialContent = [
`# JBook

This is an interactive Javascript coding environment. You can write Javascript, see it executed, and write comprehensive documentation using markdown.

- Click any cell (including this one) to edit it
- The code in each code editor cell is all joined together into one file. If you define a variable in cell #1, you can refer to it in any following cell!
- You can show any React component, string, number, or anything else by calling the \`show\` function. This is a built-in function in this environment. Call show multiple times to show multiple values
- Re-order or delete cells using the buttons on the top right of the cell
- Add new cells by hovering on the divider between each cell
All of your changes get saved to the file you opened JBook with. So if you ran \`npx jbook serve test.js\`, all of the text and code you write will be saved to the \`test.js\` file.  
`, 

`import {useState} from 'react';
  const Counter = () => {
    const [count, setCount] = useState(0);
    return (
      <div>
        <button onClick={() => setCount(count + 1)}>Click</button>
        <h3>Count: {count}</h3>
      </div>
    )
  };

// Display any variable or React Component by calling 'show'
show(<Counter />);
`
];
const initialOrder = [randomId(), randomId()];
const initialData = Object.fromEntries(initialOrder.map((key, index): [key:string, content:Cell] => {
  return [key, {
    id: key,
    type: index % 2 === 0 ? 'text' : 'code',
    content: initialContent[index]
  }];
}));

const initialState: CellsState = {
  loading: false,
  error: null,
  order: initialOrder,
  data: initialData,
};



const reducer = produce((state: CellsState = initialState, action: Action) => {
  switch (action.type) {
    case ActionType.SAVE_CELLS_ERROR:
      state.error = action.payload;
      return state;
    case ActionType.FETCH_CELLS:
      state.loading = true;
      state.error = null;
      return state;
    case ActionType.FETCH_CELLS_COMPLETE:
      state.order = action.payload.map(cell => cell.id);
      state.data = action.payload.reduce((acc, cell) => {
        acc[cell.id] = cell;
        return acc;
      }, {} as CellsState['data']);
      return state;
    case ActionType.FETCH_CELLS_ERROR:
      state.loading = false;
      state.error = action.payload;
      return state;
    case ActionType.UPDATE_CELL:
      const { id, content } = action.payload;
      state.data[id].content = content;
      return state;
    case ActionType.DELETE_CELL:
      delete state.data[action.payload];
      state.order = state.order.filter((id) => id !== action.payload);
      return state;
    case ActionType.MOVE_CELL:
      const { direction } = action.payload;
      const index = state.order.findIndex((id) => id === action.payload.id);
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex > state.order.length - 1) {
        return state;
      }

      state.order[index] = state.order[targetIndex];
      state.order[targetIndex] = action.payload.id;
      return state;
    case ActionType.INSERT_CELL_AFTER:
      const cell: Cell = {
        id: randomId(),
        content: '',
        type: action.payload.type
      };

      state.data[cell.id] = cell;
      const foundIndex = state.order.findIndex(id => id === action.payload.id);
      if (foundIndex === -1) {
        state.order.unshift(cell.id);
      } else {
        state.order.splice(foundIndex + 1, 0, cell.id);
      }
      return state;
    default:
      return state;
  }
}, initialState);




export default reducer;
