import { Route, Routes } from 'react-router-dom';
import { ChannelsPage } from './pages/ChannelsPage/ChannelsPage';
import { HomePage } from './pages/HomePage/HomePage';
import { LoginPage } from './pages/LoginPage/LoginPage';
import { RegisterPage } from './pages/RegisterPage/RegisterPage';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/registration" element={<RegisterPage />} />
        <Route path="channels">
          <Route path=":campaignId" element={<ChannelsPage />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
