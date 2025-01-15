import React from 'react';
import { Cell } from '../store';
import CodeCell from './CodeCell';
import TextEditor from './TextEditor';
import ActionBar from './ActionBar';
import './CellItem.css';

interface CellItemProps {
  cell: Cell;
}

const CellItem: React.FC<CellItemProps> = ({ cell }) => {
 
  let child: JSX.Element;
  if (cell.type === 'code') {
    child = (
      <>
        <div className="action-bar-wrapper">
          <ActionBar id={cell.id} />
        </div>
        <CodeCell cell={cell} />
      </>
    );
  } else {
    child = (
      <>
        <ActionBar id={cell.id} />
        <TextEditor cell={cell} />
      </>
    );
  }

  return <div className="cell-item">{child}</div>;
};

export default CellItem;
