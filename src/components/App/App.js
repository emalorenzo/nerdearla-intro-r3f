import { Message } from '../Message/Message';
import { Scene } from '../Scene/Scene';
import './App.css';

export const App = () => {
  return (
    <div className="app-wrapper">
      <Message />
      <Scene />
    </div>
  );
};
