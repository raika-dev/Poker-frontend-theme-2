import Route from "./routes";
import SocketProvider from "./components/SocketProvider";

const App = () => {
  return (
    <SocketProvider>
      <Route />
    </SocketProvider>
  );
};

export default App;
