import styles from './App.module.scss';
import Dashboard from './Dashboard';

function App() {
  return (
    <div className={styles['app']}>
      <Dashboard />
    </div>
  );
}

export default App;
