export const ALL_PERMISSIONS = {
    PRODUCTS: {
        GET: { method: "GET", apiPath: '/api/v1/products', module: "PRODUCTS" },
        CREATE: { method: "POST", apiPath: '/api/v1/products', module: "PRODUCTS" },
        UPDATE: { method: "PATCH", apiPath: '/api/v1/products/:id', module: "PRODUCTS" },
        DELETE: { method: "DELETE", apiPath: '/api/v1/products/:id', module: "PRODUCTS" },
    },
    CATEGORIES: {
        GET: { method: "GET", apiPath: '/api/v1/categories', module: "CATEGORIES" },
        CREATE: { method: "POST", apiPath: '/api/v1/categories', module: "CATEGORIES" },
        UPDATE: { method: "PATCH", apiPath: '/api/v1/categories/:id', module: "CATEGORIES" },
        DELETE: { method: "DELETE", apiPath: '/api/v1/categories/:id', module: "CATEGORIES" },
    },
    PROMOTIONS: {
        GET: { method: "GET", apiPath: '/api/v1/promotions', module: "PROMOTIONS" },
        CREATE: { method: "POST", apiPath: '/api/v1/promotions', module: "PROMOTIONS" },
        UPDATE: { method: "PATCH", apiPath: '/api/v1/promotions/:id', module: "PROMOTIONS" },
        DELETE: { method: "DELETE", apiPath: '/api/v1/promotions/:id', module: "PROMOTIONS" },
    },
    USERS: {
        GET: { method: "GET", apiPath: '/api/v1/users', module: "USERS" },
        CREATE: { method: "POST", apiPath: '/api/v1/users', module: "USERS" },
        UPDATE: { method: "PATCH", apiPath: '/api/v1/users/:id', module: "USERS" },
        DELETE: { method: "DELETE", apiPath: '/api/v1/users/:id', module: "USERS" },
    },
    PERMISSIONS: {
        GET: { method: "GET", apiPath: '/api/v1/permissions', module: "PERMISSIONS" },
        CREATE: { method: "POST", apiPath: '/api/v1/permissions', module: "PERMISSIONS" },
        UPDATE: { method: "PATCH", apiPath: '/api/v1/permissions/:id', module: "PERMISSIONS" },
        DELETE: { method: "DELETE", apiPath: '/api/v1/permissions/:id', module: "PERMISSIONS" },
    },
    ROLES: {
        GET: { method: "GET", apiPath: '/api/v1/roles', module: "ROLES" },
        CREATE: { method: "POST", apiPath: '/api/v1/roles', module: "ROLES" },
        UPDATE: { method: "PATCH", apiPath: '/api/v1/roles/:id', module: "ROLES" },
        DELETE: { method: "DELETE", apiPath: '/api/v1/roles/:id', module: "ROLES" },
    },
    ORDERS: {
        GET: { method: "GET", apiPath: '/api/v1/orders', module: "ORDERS" },
        CREATE: { method: "POST", apiPath: '/api/v1/orders', module: "ORDERS" },
        UPDATE: { method: "PATCH", apiPath: '/api/v1/orders/:id', module: "ORDERS" },
        DELETE: { method: "DELETE", apiPath: '/api/v1/orders/:id', module: "ORDERS" },
    },
    SETTINGS: {
        GET: { method: "GET", apiPath: '/api/v1/settings', module: "SETTINGS" },
        UPDATE: { method: "PATCH", apiPath: '/api/v1/settings', module: "SETTINGS" },
    },
}


export const ALL_MODULES = {
    PRODUCTS: "PRODUCTS",
    CATEGORIES: "CATEGORIES",
    PROMOTIONS: "PROMOTIONS",
    USERS: 'USERS',
    PERMISSIONS: 'PERMISSIONS',
    ROLES: 'ROLES',
    ORDERS: "ORDERS",
    SETTINGS: "SETTINGS",
}