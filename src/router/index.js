import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

let routes = [
	{
		// will match everything
		path: '*',
		component: () => import('../views/404.vue'),
	},
	{
		path: '/',
		name: 'Home',
		redirect: '/dashboard',
	},
	{
		path: '/dashboard',
		name: 'Dashboard',
		layout: "dashboard",
		// route level code-splitting
		// this generates a separate chunk (about.[hash].js) for this route
		// which is lazy-loaded when the route is visited.
		component: () => import(/* webpackChunkName: "dashboard" */ '../views/Dashboard.vue'),
	},
	{
		path: '/basic/start',
		name: 'Start',
		layout: "dashboard",
		component: () => import('../views/basic/Start.vue'),
	},
	{
		path: '/basic/results',
		name: 'Results',
		layout: "dashboard",
		component: () => import('../views/basic/Results.vue'),
	},
	{
		path: '/restlet/idea',
		name: 'Idea',
		layout: "dashboard",
		component: () => import('../views/restlet/Idea.vue'),
	},
	{
		path: '/restlet/examples/query',
		name: 'Query',
		layout: "dashboard",
		component: () => import('../views/restlet/Query.vue'),
	},
	{
		path: '/restlet/examples/edit',
		name: 'Edit',
		layout: "dashboard",
		component: () => import('../views/restlet/Edit.vue'),
	},
	{
		path: '/auth/users',
		name: 'Users',
		layout: "dashboard",
		component: () => import('../views/authentication/Users.vue'),
	},
	{
		path: '/auth/roles',
		name: 'Roles',
		layout: "dashboard",
		component: () => import('../views/authentication/Roles.vue'),
	},
	{
		path: '/auth/permissions',
		name: 'Permissions',
		layout: "dashboard",
		component: () => import('../views/authentication/Permissions.vue'),
	},
	{
		path: '/builtin/address',
		name: 'Address',
		layout: "dashboard",
		component: () => import('../views/builtins/Address.vue'),
	},
	{
		path: '/builtin/async',
		name: 'Async',
		layout: "dashboard",
		component: () => import('../views/builtins/Async.vue'),
	},
	{
		path: '/builtin/quartz',
		name: 'Quartz',
		layout: "dashboard",
		component: () => import('../views/builtins/Quartz.vue'),
	},
	{
		path: '/builtin/version',
		name: 'Version',
		layout: "dashboard",
		component: () => import('../views/builtins/Version.vue'),
	},
	{
		path: '/doc/howto',
		name: 'How To',
		layout: "dashboard",
		component: () => import('../views/documents/Howto.vue'),
	},
	{
		path: '/doc/contribute',
		name: 'Contribute',
		layout: "dashboard",
		component: () => import('../views/documents/Contribute.vue'),
	},
	{
		path: '/layout',
		name: 'Layout',
		layout: "dashboard",
		component: () => import('../views/Layout.vue'),
	},
	{
		path: '/tables',
		name: 'Tables',
		layout: "dashboard",
		component: () => import('../views/Tables.vue'),
	},
	{
		path: '/billing',
		name: 'Billing',
		layout: "dashboard",
		component: () => import('../views/Billing.vue'),
	},
	{
		path: '/rtl',
		name: 'RTL',
		layout: "dashboard-rtl",
		meta: {
			layoutClass: 'dashboard-rtl',
		},
		component: () => import('../views/RTL.vue'),
	},
	{
		path: '/Profile',
		name: 'Profile',
		layout: "dashboard",
		meta: {
			layoutClass: 'layout-profile',
		},
		component: () => import('../views/Profile.vue'),
	},
	{
		path: '/sign-in',
		name: 'Sign-In',
		component: () => import('../views/Sign-In.vue'),
	},
	{
		path: '/sign-up',
		name: 'Sign-Up',
		meta: {
			layoutClass: 'layout-sign-up',
		},
		component: () => import('../views/Sign-Up.vue'),
	},
]

// Adding layout property from each route to the meta
// object so it can be accessed later.
function addLayoutToRoute( route, parentLayout = "default" )
{
	route.meta = route.meta || {} ;
	route.meta.layout = route.layout || parentLayout ;
	
	if( route.children )
	{
		route.children = route.children.map( ( childRoute ) => addLayoutToRoute( childRoute, route.meta.layout ) ) ;
	}
	return route ;
}

routes = routes.map( ( route ) => addLayoutToRoute( route ) ) ;

const router = new VueRouter({
	mode: 'hash',
	base: process.env.BASE_URL,
	routes,
	scrollBehavior (to, from, savedPosition) {
		if ( to.hash ) {
			return {
				selector: to.hash,
				behavior: 'smooth',
			}
		}
		return {
			x: 0,
			y: 0,
			behavior: 'smooth',
		}
	}
})

export default router
