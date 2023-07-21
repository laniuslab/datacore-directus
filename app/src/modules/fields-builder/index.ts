import { defineModule } from '@directus/utils';
import Index from './routes/dashboard.vue';

export default defineModule({
	id: 'fields-builder',
	name: '$t:fields-query-builder',
	icon: 'memory',
	routes: [
		{
			name: 'fields-builder',
			path: '',
			component: Index,
		},
		{
			name: 'fields-builder-collection',
			path: ':collection',
			component: Index,
			props: true,
		},
	],
	preRegisterCheck(user) {
		const admin = user.role.admin_access;

		if (admin) return true;

		return false;
	},
});
