import * as React from "react";
import { Provider } from "react-redux";
import { HashRouter as Router, Switch, Route } from "react-router-dom";
import { CssBaseline, makeStyles, Container, Grid } from "@material-ui/core";

import { store } from "./store";

import DarkThemeProvider from "./features/darkThemeProvider/DarkThemeProvider";
import Navbar from "./features/navbar/Navbar";
import AlertsList from "./features/alerts/AlertsList";
import IndexPage from "./features/index/IndexPage";
import LoginForm from "./features/login/LoginForm";
import LogoutPage from "./features/auth/LogoutPage";
import TryAuthWithCurrentToken from "./features/auth/TryAuthWithCurrentToken";
import WorkplacesPage from "./features/workplaces/WorkplacesPage";
import EmployeePage from "./features/employees/EmployeePage";

const useStyles = makeStyles((theme) => ({
    container: {
        marginTop: theme.spacing(2),
    },
}));

const App = () => {
    const classes = useStyles();

    return (
        <Provider store={store}>
            {/* This component tries to authenticate the user upon site loading (with localStorage "token"). */}
            <TryAuthWithCurrentToken />
            <DarkThemeProvider>
                <CssBaseline />
                <Router>
                    <Navbar />
                    <Container className={classes.container}>
                        <Grid container spacing={2} direction="column">
                            <Grid item>
                                <AlertsList />
                            </Grid>
                            <Grid item>
                                <Switch>
                                    <Route exact path="/">
                                        <IndexPage />
                                    </Route>
                                    <Route exact path="/login">
                                        <LoginForm />
                                    </Route>
                                    <Route exact path="/logout">
                                        <LogoutPage />
                                    </Route>
                                    <Route exact path="/workplaces">
                                        <WorkplacesPage />
                                    </Route>
                                    <Route exact path="/employees">
                                        <EmployeePage />
                                    </Route>
                                </Switch>
                            </Grid>
                        </Grid>
                    </Container>
                </Router>
            </DarkThemeProvider>
        </Provider>
    );
};

export default App;
