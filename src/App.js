import './App.css';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Rotas from './routes/Rotas';
import HomePage from './views/Home';
import 'semantic-ui-css/semantic.min.css'


const App = () => {
	return (
		<Router>
			<Switch>
				<Route path={Rotas.base} exact component={HomePage}/>	
			</Switch>
      	</Router>
	);
}

export default App;
