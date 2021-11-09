import * as React from "react";
import WorkplaceLoader from "./WorkplaceLoader";
import WorkplaceWidget from "./workplaces";

const WorkplaceListPage = () => (
    <WorkplaceLoader>
        <WorkplaceListImplPage />
    </WorkplaceLoader>
);

export default WorkplaceListPage;

/**
 *
 */

const WorkplaceListImplPage = () => {
    return <WorkplaceWidget />;
};
