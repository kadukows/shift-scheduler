import * as React from "react";
import { Provider } from "react-redux";
import { HashRouter as Router, Switch, Route } from "react-router-dom";
import { CssBaseline, Container, Grid } from "@mui/material";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import { SnackbarProvider } from "notistack";
import { store } from "./store";
import DarkThemeProvider from "./features/darkThemeProvider/DarkThemeProvider";
import Navbar from "./features/navbar/Navbar";
import IndexPage from "./features/index/IndexPage";
import LoginForm from "./features/login/LoginForm";
import LogoutPage from "./features/auth/LogoutPage";
import TryAuthWithCurrentToken from "./features/auth/TryAuthWithCurrentToken";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import DraggablePage from "./features/draggableOnMuiTable/DraggablePage";
import PrivateRoute from "./features/auth/PrivateRote";
import PlannerLoader from "./features/planner/PlannerLoader";
import NotifierComponent from "./features/alerts/NotifierComponent";
import {
    WorkplaceDashboardPage,
    WorkplaceListPage,
} from "./features/workplaceDashboard";
import AsEmployeeDashboard from "./features/userAsEmployee/dashboard/Dashboard";
import { WebsiteMode } from "./features/navbar/WebsiteMode";
import ShiftPage from "./features/userAsEmployee/shift/ShiftPage";

const App = () => {
    return (
        <Provider store={store}>
            <DndProvider backend={HTML5Backend}>
                <TryAuthWithCurrentToken />
                <DarkThemeProvider>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <SnackbarProvider>
                            <NotifierComponent />
                            <CssBaseline />
                            <Router>
                                <Navbar />
                                <Container sx={{ mt: 2 }}>
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
                                            mode={WebsiteMode.Manager}
                                        >
                                            <WorkplaceListPage />
                                        </PrivateRoute>
                                        <PrivateRoute
                                            exact
                                            path="/planner/:schedule_id"
                                            mode={WebsiteMode.Manager}
                                        >
                                            <PlannerLoader />
                                        </PrivateRoute>
                                        <PrivateRoute
                                            exact
                                            path="/draggables"
                                            mode={WebsiteMode.Manager}
                                        >
                                            <DraggablePage />
                                        </PrivateRoute>
                                        <PrivateRoute
                                            exact
                                            path="/workplaceDashboard/:workplaceId"
                                            mode={WebsiteMode.Manager}
                                        >
                                            <WorkplaceDashboardPage />
                                        </PrivateRoute>
                                        <PrivateRoute
                                            exact
                                            path="/as_employee/dashboard"
                                            mode={WebsiteMode.Employee}
                                        >
                                            <AsEmployeeDashboard />
                                        </PrivateRoute>
                                        <PrivateRoute
                                            exact
                                            path="/as_employee/schedule/:schedule_id"
                                        >
                                            <ShiftPage />
                                        </PrivateRoute>
                                    </Switch>
                                </Container>
                            </Router>
                        </SnackbarProvider>
                    </LocalizationProvider>
                </DarkThemeProvider>
            </DndProvider>
        </Provider>
    );
};

export default App;
