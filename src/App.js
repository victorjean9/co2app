import './App.css';
import HomePage from './views/Home';
import 'semantic-ui-css/semantic.min.css';
import { Header, Icon } from 'semantic-ui-react';

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
			<HomePage />
		</>
	);
}

export default App;
