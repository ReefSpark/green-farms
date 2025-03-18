import "@fortawesome/fontawesome-free/css/all.min.css";
import { Provider } from "react-redux";
import appStore from "./utils/appStore";
import ManiPage from "./components/ManiPage";
function App() {
  return (
    <Provider store={appStore}>
      <div>
        <ManiPage />
      </div>
    </Provider>
  );
}

export default App;
