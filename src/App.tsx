import { Route } from 'react-router';
import { Routes } from 'react-router';
import { BrowserRouter } from 'react-router';
import Home from './page/Home';
import Signin from './page/Signin';
import Signup from './page/Signup';
import { ProtectedRoute } from './Routes/ProtectedRoute';
import UpdateUser from './page/UpdateUser';
import { AnonymousOnlyRoute } from './Routes/AnonymousOnlyRoute';
import PublicOnlyRoute from './Routes/PublicOnlyRoute';
import Registered from './page/Registered';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 本ユーザー専用 */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Home />} />
        </Route>
        {/* 仮ユーザー専用 */}
        <Route element={<AnonymousOnlyRoute />}>
          <Route path="/updateUser" element={<UpdateUser />} />
        </Route>
        {/* 未ログイン専用 */}
        <Route element={<PublicOnlyRoute />}>
          <Route path="/signin" element={<Signin />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/registered" element={<Registered />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
