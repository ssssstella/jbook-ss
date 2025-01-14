import React, { Fragment, useEffect } from 'react';
import { useTypedSelector } from '../hooks/useTypedSelector';
import AddCell from './AddCell';
import CellItem from './CellItem';
import './CellList.css';
import { useActions } from '../hooks/useActions';

const CellList: React.FC = () => {
  const { data, order } = useTypedSelector((state) => state.cells);
  const cells = order.map((id: string) => data[id]);
  const { fetchCells } = useActions();
  useEffect(() => {
    fetchCells();
  }, []);

  const renderedCells = cells.map((cell) => (
    <Fragment key={cell.id}>
      <CellItem cell={cell} />
      <AddCell prevCellId={cell.id} />
    </Fragment>
  ));

  return (
    <div className="cell-list">
      <AddCell forceVisible={cells.length === 0} prevCellId={null} />
      {renderedCells}
    </div>
  );
};

export default CellList;
