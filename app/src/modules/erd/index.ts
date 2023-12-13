import { defineModule } from '@directus/extensions';
import ERDViewer from './routes/dashboard.vue';
import ERDOverview from './routes/overview.vue';

export default defineModule({
	id: 'erd-viewer',
	name: '$t:erd_viewer',
	icon: 'device_hub',
	routes: [
		{
			name: 'erd-viewer-collection',
			path: ':collectionName',
			component: ERDOverview,
			props: true,
		},
		{
			name: 'erd-viewer',
			path: '',
			component: ERDViewer,
			props: true,
		},
	],
	preRegisterCheck(user) {
		const admin = user.role?.admin_access;

		if (admin) return true;

		return false;
	},
});
