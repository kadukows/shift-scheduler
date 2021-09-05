import * as React from "react";

interface Props {
    name?: string;
}

const App = ({ name }: Props) => {
    return <h1>Hello {name ? name : "react"}!</h1>;
};

export default App;
