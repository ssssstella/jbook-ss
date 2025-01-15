import express from 'express';
import fs from 'fs/promises';
import path from 'path';

interface Cell {
  id: string;
  content: string;
  type: 'text' | 'code';
}

interface LocalApiError {
  code: string;
}

const randomId = () => {
  return Math.random().toString(36).substring(2, 7);
}

const defaultIds = [randomId(), randomId()];
const defaultContent = [
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

const defaultCells = defaultIds.map((key, index) => {
  return {
    id: key,
    type: index % 2 === 0 ? 'text' : 'code',
    content: defaultContent[index]
  };
});

export const createCellsRouter = (filename: string, dir: string) => {
  const router = express.Router();
  router.use(express.json());
  
  const fullPath = path.join(dir, filename);

  router.get('/cells', async (req, res) => {
    const isLocalApiError = (err: any): err is LocalApiError => {
      return typeof err.code === 'string';
    };

    try {
      const result = await fs.readFile(fullPath, { encoding: 'utf-8' });
      res.send(JSON.parse(result));

    } catch (err) {
      if (isLocalApiError(err)) {
        if (err.code === 'ENOENT') {
          await fs.writeFile(fullPath, JSON.stringify(defaultCells), 'utf-8');
          res.send(defaultCells);
        }
      } else {
        throw err;
      }
    }
  });

  router.post('/cells', async (req, res) => {
    const { cells }: { cells: Cell[] } = req.body;
    await fs.writeFile(fullPath, JSON.stringify(cells), 'utf-8');

    res.send({ status: 'ok' });
  });

  return router;
};
