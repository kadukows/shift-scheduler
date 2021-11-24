export const MANAGER_API_ROUTES = {
    workplace: "/api/manager/workplace/",
    employee: "/api/manager/employee/",
    schedule: "/api/manager/schedule/",
    shift: "/api/manager/shift/",
    role: "/api/manager/role/",
    shiftBatchCopy: (shiftId: number) =>
        `/api/manager/shift/${shiftId}/batch_copy/`,
    employeeGetBindingKey: (employeeId: number) =>
        `/api/manager/employee/${employeeId}/get_binding_key/`,
    shiftTemplate: "/api/manager/shift_template/",
};

export const GENERAL_API_ROUTES = {
    user: "/api/user/",
    getToken: "/api/get_token/",
};

export const EMPLOYEE_API_ROUTES = {
    workplace: "/api/employee/workplace/",
    employee: "/api/employee/employee/",
    schedule: "/api/employee/schedule/",
    shift: "/api/employee/shift/",
    role: "/api/employee/role/",
    employeeBindNewEmployee: "/api/employee/employee/bind_new_employee/",
    employeeDeleteBinding: (employeeId: number) =>
        `/api/employee/employee/${employeeId}/delete_bound_employee/`,
    employeeScheduleGetICal: (scheduleId: number) =>
        `/api/employee/schedule/${scheduleId}/get_ical/`,
};
