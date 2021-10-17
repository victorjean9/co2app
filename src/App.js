import './App.css';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Rotas from './routes/Rotas';
import HomePage from './views/Home';
import 'semantic-ui-css/semantic.min.css';
import { Header, Icon } from 'semantic-ui-react';
import { createBrowserHistory } from 'history';

export const history = createBrowserHistory({
    basename: process.env.PUBLIC_URL
});

const MenuPrincipal = () => {
	return (
		<div id="Menu-principal">
			<Header id="Menu-principal-header" as="h1">
				<Icon name="thermometer half"/>
				<Header.Content>Medidor CO₂</Header.Content> 
			</Header>
		</div>
	);
}

const App = () => {
	return (
		<>
			<MenuPrincipal />
			<Router>
				<Switch>
					<Route path={Rotas.base} exact component={HomePage}/>	
				</Switch>
			</Router>
		</>
	);
}

export default App;
