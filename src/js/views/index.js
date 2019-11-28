import Home from './_home.svelte'
import Studios from './_studios.svelte'

const routes = [
    {
        name: '/',
        component: Home
    },
    {
        name: '/estudios',
        component: Studios,
        // layout: PublicLayout
    },
    // {
    //     name: 'admin',
    //     component: AdminLayout,
    //     onlyIf: { guard: userIsAdmin, redirect: '/login' },
    //     nestedRoutes: [
    //         { name: 'index', component: AdminIndex },
    //         {
    //             name: 'employees',
    //             component: '',
    //             nestedRoutes: [{ name: 'index', component: EmployeesIndex }, { name: 'show/:id', component: EmployeesShow }]
    //         }
    //     ]
    // }
]

export { routes }