import { Route } from 'react-router';
import { Routes } from 'react-router';
import { BrowserRouter } from 'react-router';
import Home from './page/Home';
import Signin from './page/Signin';
import Signup from './page/Signup';
import { ProtectedRoute } from './Routes/ProtectedRoute';
import UpdateUser from './page/UpdateUser';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Home />} />
        </Route>
        <Route path="/signin" element={<Signin />}></Route>
        <Route path="/signup" element={<Signup />}></Route>
        <Route path="/updateUser" element={<UpdateUser />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
