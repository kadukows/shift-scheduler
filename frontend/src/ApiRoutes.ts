export const MANAGER_API_ROUTES = {
    workplace: "/api/manager/workplace/",
    employee: "/api/manager/employee/",
    schedule: "/api/manager/schedule/",
    shift: "/api/manager/shift/",
    role: "/api/manager/role/",
    shiftBatchCopy: (shiftId: number) =>
        `/api/manager/shift/${shiftId}/batch_copy/`,
};

export const GENERAL_API_ROUTES = {
    user: "/api/user/",
};

export const EMPLOYEE_API_ROUTES = {
    workplace: "/api/employee/workplace/",
    employee: "/api/employee/employee/",
    schedule: "/api/employee/schedule/",
    shift: "/api/employee/shift/",
    role: "/api/employee/role/",
};
