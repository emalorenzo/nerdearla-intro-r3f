import { Message } from '../Message/Message';
import { MainScene } from '../../scenes/MainScene/MainScene';
import './App.css';

export const App = () => {
  return (
    <div className="app-wrapper">
      <Message />
      <MainScene />
    </div>
  );
};
