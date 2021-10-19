import * as React from "react";
import { Provider } from "react-redux";
import { HashRouter as Router, Switch, Route } from "react-router-dom";
import { CssBaseline, Container, Grid } from "@mui/material";
import makeStyles from '@mui/styles/makeStyles';
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";

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
import SchedulePage from "./features/schedules/SchedulesPage";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import DraggablePage from "./features/draggableOnMuiTable/DraggablePage";
import PrivateRoute from "./features/auth/PrivateRote";
import PlannerBoard from "./features/planner/PlannerBoard";
import PlannerLoader from "./features/planner/PlannerLoader";

const useStyles = makeStyles((theme) => ({
    container: {
        marginTop: theme.spacing(2),
    },
}));

const App = () => {
    const classes = useStyles();

    return (
        <Provider store={store}>
            <DndProvider backend={HTML5Backend}>
                {/* This component tries to authenticate the user upon site loading (with localStorage "token"). */}
                <TryAuthWithCurrentToken />
                <DarkThemeProvider>
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
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
                                            <PrivateRoute
                                                exact
                                                path="/workplaces"
                                            >
                                                <WorkplacesPage />
                                            </PrivateRoute>
                                            <PrivateRoute
                                                exact
                                                path="/employees"
                                            >
                                                <EmployeePage />
                                            </PrivateRoute>
                                            <PrivateRoute
                                                exact
                                                path="/schedules"
                                            >
                                                <SchedulePage />
                                            </PrivateRoute>
                                            <PrivateRoute path="/planner/:schedule_id">
                                                <PlannerLoader />
                                            </PrivateRoute>
                                            <PrivateRoute
                                                exact
                                                path="/draggables"
                                            >
                                                <DraggablePage />
                                            </PrivateRoute>
                                        </Switch>
                                    </Grid>
                                </Grid>
                            </Container>
                        </Router>
                    </MuiPickersUtilsProvider>
                </DarkThemeProvider>
            </DndProvider>
        </Provider>
    );
};

export default App;
