import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../../../store";
import { roleSelectors } from "../../roles/rolesSlice";

export const rolesByWorkplaceSelector = createSelector(
    [
        (state: RootState) => roleSelectors.selectAll(state),
        (state: RootState, workplaceId: number) => workplaceId,
    ],
    (roles, workplaceId) =>
        roles.filter((role) => role.workplace === workplaceId)
);
