import { useTypedSelector } from "./useTypedSelector";

export const useCumulativeCode = (cellId: string) => {
  const { data, order } = useTypedSelector((state) => state.cells);
  const orderedCells = order.map((id) => data[id]);
  const showFunc = `
    import _React from 'react';
    import { createRoot as _createRoot } from 'react-dom/client';
    var show = (value) => {
      const rootEl = document.getElementById('root');
      const rootReact = _createRoot(rootEl);
      if (typeof value === 'object') {
        if (value.$$typeof && value.props) {
          rootReact.render(value);
        }
        rootEl.innerHTML = JSON.stringify(value);
      } else {
        rootEl.innerHTML = value;
      }
      
    };
  `;
  const showFuncNoop = `var show = () => {}`;

  const cumulativeCode: string[] = [];
  for (let c of orderedCells) {
    if (c.type === 'code') {
      if (c.id === cellId) {
        cumulativeCode.push(showFunc);
      } else {
        cumulativeCode.push(showFuncNoop);
      }
      cumulativeCode.push(c.content);
    }

    if (c.id === cellId) {
      break;
    }
  }

  return cumulativeCode.join('\n');
}