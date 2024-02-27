import './App.css';
import {BrowserRouter as Router,Routes,Route} from 'react-router-dom';
import EmployeeForm from './Components/EmployeeForm';
import EmployeeList from './Components/EmployeeList';
import AdminLogin from './Components/AdminLogin';
function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path='/employee-form' element={<EmployeeForm/>}/>
          <Route path='/employee-list' element={<EmployeeList/>}/>
          <Route path='/' element={<AdminLogin/>}/>
        </Routes>
      </Router>
      
    </div>
  );
}

export default App;
