import React, { Component, Fragment } from "react";
import { Link, withRouter } from "react-router-dom";
import { Nav, Navbar, NavItem } from "react-bootstrap";
import Routes from "./Routes";
import { LinkContainer } from "react-router-bootstrap"
import { Auth } from "aws-amplify";
import "./App.css";
import logo from "./components/favicon.png";
class App extends Component {
	constructor(props) {
	super(props);
		this.state = {
			isAuthenticating: true,
			isAuthenticated: false
		};
	}
	async componentDidMount() {
		try {
			if (await Auth.currentSession()) {
			this.userHasAuthenticated(true);
			}
		}
		catch(e) {
			if (e !== 'No current user') {
				alert(e);
			}
		}
		this.setState({ isAuthenticating: false });
	}
	userHasAuthenticated = authenticated => {
		this.setState({ isAuthenticated: authenticated });
	}
	handleLogout = async event => {
		await Auth.signOut();
		this.userHasAuthenticated(false);
		this.props.history.push("/login");
	}
	render() {
		const childProps = {
		  isAuthenticated: this.state.isAuthenticated,
		  userHasAuthenticated: this.userHasAuthenticated
		};
		return (
			!this.state.isAuthenticating &&
			<div className="App container">
				<Navbar fluid collapseOnSelect>
					<Navbar.Header>
						<Navbar.Brand>
							<Link to="/"><span><img src={logo} alt={"Q"}/>ueue Notes</span></Link>
						</Navbar.Brand>
						<Navbar.Toggle />
					</Navbar.Header>
					<Navbar.Collapse>
						<Nav pullRight>
							{this.state.isAuthenticated
							? <NavItem onClick={this.handleLogout}>Logout</NavItem>
							: <Fragment>
								<LinkContainer to="/signup">
								  <NavItem>Signup</NavItem>
								</LinkContainer>
								<LinkContainer to="/login">
								  <NavItem>Login</NavItem>
								</LinkContainer>
							  </Fragment>
							}
						</Nav>
					</Navbar.Collapse>
				</Navbar>
				<Routes childProps={childProps} />
			</div>
		);
	}
}


export default withRouter(App);
