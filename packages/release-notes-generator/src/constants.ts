import { VersionType } from '@changesets/types';

export const REPO = 'directus/directus';

export const MAIN_PACKAGE = 'directus';

export const UNTYPED_PACKAGES = {
	docs: '📝 Documentation',
	'tests-blackbox': '🧪 Blackbox Tests',
} as const satisfies Record<string, string>;

export const PACKAGE_ORDER = ['@new-mv-datacore/app', '@new-mv-datacore/api'];

export const TYPE_MAP = {
	major: '⚠️ Potential Breaking Changes',
	minor: '✨ New Features & Improvements',
	patch: '🐛 Bug Fixes & Optimizations',
	none: '📎 Misc.',
} as const satisfies Record<VersionType, string>;

export const NOTICE_TYPE = TYPE_MAP.major;

export const VERSIONS_TITLE = '📦 Published Versions';
