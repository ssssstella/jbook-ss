import ReactDOM from 'react-dom/client';
import 'bulmaswatch/superhero/bulmaswatch.min.css';
import { Provider } from 'react-redux';
import { store } from './store';
import CellList from './components/CellList';
import '@fortawesome/fontawesome-free/css/all.min.css';

const el = document.getElementById('root');
const root = ReactDOM.createRoot(el!);

const App = () => {
  return (
    <Provider store={store}>
      <div>
        <CellList />
      </div>
    </Provider>
  );
};

root.render(<App />);
