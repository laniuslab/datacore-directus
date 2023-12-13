import { Action } from '@directus/constants';
import type { Accountability, SchemaOverview } from '@directus/types';
import jwt from 'jsonwebtoken';
import { type Knex } from 'knex';
import { clone, cloneDeep } from 'lodash-es';
import ms from 'ms';
import { performance } from 'perf_hooks';
import { getAuthProvider } from '../../auth.js';
import { DEFAULT_AUTH_PROVIDER } from '../../constants.js';
import getDatabase from '../../database/index.js';
import emitter from '../../emitter.js';
import env from '../../env.js';
import { InvalidCredentialsError, UserSuspendedError } from '@directus/errors';
import { createRateLimiter } from '../../rate-limiter.js';
import { ActivityService, SettingsService } from '../../services/index.js';
import type { LoginResult, User } from '../../types/auth.js';
import type { AbstractServiceOptions } from '../../types/services.js';
import { stall } from '../../utils/stall.js';

const loginAttemptsLimiter = createRateLimiter('RATE_LIMITER', { duration: 0 });

export class MVAuthenticationService {
	knex: Knex;
	accountability: Accountability | null;
	activityService: ActivityService;
	schema: SchemaOverview;

	constructor(options: AbstractServiceOptions) {
		this.knex = options.knex || getDatabase();
		this.accountability = options.accountability || null;
		this.activityService = new ActivityService({ knex: this.knex, schema: options.schema });
		this.schema = options.schema;
	}

	/**
	 * Retrieve the tokens for a given user email.
	 *
	 * Password is optional to allow usage of this function within the SSO flow and extensions. Make sure
	 * to handle password existence checks elsewhere
	 */
	async loginRequest(providerName: string = DEFAULT_AUTH_PROVIDER, payload: Record<string, any>): Promise<User> {
		const STALL_TIME = env['LOGIN_STALL_TIME'];
		const timeStart = performance.now();
		const provider = getAuthProvider(providerName);

		let userId;

		try {
			userId = await provider.getUserID(cloneDeep(payload));
		} catch (err) {
			await stall(STALL_TIME, timeStart);
			throw err;
		}

		const user = await this.knex
			.select<User & { tfa_secret: string | null }>(
				'u.id',
				'u.first_name',
				'u.last_name',
				'u.email',
				'u.password',
				'u.status',
				'u.role',
				'r.admin_access',
				'r.app_access',
				'u.tfa_secret',
				'u.provider',
				'u.external_identifier',
				'u.auth_data'
			)
			.from('directus_users as u')
			.leftJoin('directus_roles as r', 'u.role', 'r.id')
			.where('u.id', userId)
			.first();

		const updatedPayload = await emitter.emitFilter(
			'auth.login',
			payload,
			{
				status: 'pending',
				user: user?.id,
				provider: providerName,
			},
			{
				database: this.knex,
				schema: this.schema,
				accountability: this.accountability,
			}
		);

		const emitStatus = (status: 'fail' | 'success') => {
			emitter.emitAction(
				'auth.login',
				{
					payload: updatedPayload,
					status,
					user: user?.id,
					provider: providerName,
				},
				{
					database: this.knex,
					schema: this.schema,
					accountability: this.accountability,
				}
			);
		};

		if (user?.status !== 'active') {
			emitStatus('fail');

			if (user?.status === 'suspended') {
				await stall(STALL_TIME, timeStart);
				throw new UserSuspendedError();
			} else {
				await stall(STALL_TIME, timeStart);
				throw new InvalidCredentialsError();
			}
		}

		const settingsService = new SettingsService({
			knex: this.knex,
			schema: this.schema,
		});

		const { auth_login_attempts: allowedAttempts } = await settingsService.readSingleton({
			fields: ['auth_login_attempts'],
		});

		if (allowedAttempts !== null) {
			loginAttemptsLimiter.points = allowedAttempts;

			try {
				await loginAttemptsLimiter.consume(user.id);
			} catch {
				await this.knex('directus_users').update({ status: 'suspended' }).where({ id: user.id });
				user.status = 'suspended';

				// This means that new attempts after the user has been re-activated will be accepted
				await loginAttemptsLimiter.set(user.id, 0, 0);
			}
		}

		emitStatus('success');

		if (allowedAttempts !== null) {
			await loginAttemptsLimiter.set(user.id, 0, 0);
		}

		await stall(STALL_TIME, timeStart);

		return user;
	}

	/**
	 * Retrieve the tokens for a given user email.
	 *
	 * Password is optional to allow usage of this function within the SSO flow and extensions. Make sure
	 * to handle password existence checks elsewhere
	 */
	async login(providerName: string = DEFAULT_AUTH_PROVIDER, payload: Record<string, any>): Promise<LoginResult> {
		const { nanoid } = await import('nanoid');

		const STALL_TIME = env['LOGIN_STALL_TIME'];
		const timeStart = performance.now();

		const provider = getAuthProvider(providerName);

		let userId;

		try {
			userId = await provider.getUserID(cloneDeep(payload));
		} catch (err) {
			await stall(STALL_TIME, timeStart);
			throw err;
		}

		const user = await this.knex
			.select<User & { tfa_secret: string | null }>(
				'u.id',
				'u.first_name',
				'u.last_name',
				'u.email',
				'u.password',
				'u.status',
				'u.role',
				'r.admin_access',
				'r.app_access',
				'u.tfa_secret',
				'u.provider',
				'u.external_identifier',
				'u.auth_data'
			)
			.from('directus_users as u')
			.leftJoin('directus_roles as r', 'u.role', 'r.id')
			.where('u.id', userId)
			.first();

		const updatedPayload = await emitter.emitFilter(
			'auth.login',
			payload,
			{
				status: 'pending',
				user: user?.id,
				provider: providerName,
			},
			{
				database: this.knex,
				schema: this.schema,
				accountability: this.accountability,
			}
		);

		const emitStatus = (status: 'fail' | 'success') => {
			emitter.emitAction(
				'auth.login',
				{
					payload: updatedPayload,
					status,
					user: user?.id,
					provider: providerName,
				},
				{
					database: this.knex,
					schema: this.schema,
					accountability: this.accountability,
				}
			);
		};

		if (user?.status !== 'active') {
			emitStatus('fail');

			if (user?.status === 'suspended') {
				await stall(STALL_TIME, timeStart);
				throw new UserSuspendedError();
			} else {
				await stall(STALL_TIME, timeStart);
				throw new InvalidCredentialsError();
			}
		}

		const settingsService = new SettingsService({
			knex: this.knex,
			schema: this.schema,
		});

		const { auth_login_attempts: allowedAttempts } = await settingsService.readSingleton({
			fields: ['auth_login_attempts'],
		});

		if (allowedAttempts !== null) {
			loginAttemptsLimiter.points = allowedAttempts;

			try {
				await loginAttemptsLimiter.consume(user.id);
			} catch {
				await this.knex('directus_users').update({ status: 'suspended' }).where({ id: user.id });
				user.status = 'suspended';

				// This means that new attempts after the user has been re-activated will be accepted
				await loginAttemptsLimiter.set(user.id, 0, 0);
			}
		}

		try {
			await provider.login(clone(user), cloneDeep(updatedPayload));
		} catch (e) {
			emitStatus('fail');
			await stall(STALL_TIME, timeStart);
			throw e;
		}

		const tokenPayload = {
			id: user.id,
			role: user.role,
			app_access: user.app_access,
			admin_access: user.admin_access,
		};

		const customClaims = await emitter.emitFilter(
			'auth.jwt',
			tokenPayload,
			{
				status: 'pending',
				user: user?.id,
				provider: providerName,
				type: 'login',
			},
			{
				database: this.knex,
				schema: this.schema,
				accountability: this.accountability,
			}
		);

		const accessToken = jwt.sign(customClaims, env['SECRET'] as string, {
			expiresIn: env['ACCESS_TOKEN_TTL'],
			issuer: 'directus',
		});

		const refreshToken = nanoid(64);
		const refreshTokenExpiration = new Date(Date.now() + ms(env['REFRESH_TOKEN_TTL'] as string));

		// [ADD] alway clear all prev user sessions
		await this.knex('directus_sessions').delete().where({ user: user.id });

		await this.knex('directus_sessions').insert({
			token: refreshToken,
			user: user.id,
			expires: refreshTokenExpiration,
			ip: this.accountability?.ip,
			user_agent: this.accountability?.userAgent,
		});

		// await this.knex('directus_sessions').delete().where('expires', '<', new Date());

		if (this.accountability) {
			await this.activityService.createOne({
				action: Action.LOGIN,
				user: user.id,
				ip: this.accountability.ip,
				user_agent: this.accountability.userAgent,
				collection: 'directus_users',
				item: user.id,
			});
		}

		await this.knex('directus_users').update({ last_access: new Date() }).where({ id: user.id });

		emitStatus('success');

		if (allowedAttempts !== null) {
			await loginAttemptsLimiter.set(user.id, 0, 0);
		}

		await stall(STALL_TIME, timeStart);
		return {
			accessToken,
			refreshToken,
			expires: ms(env['ACCESS_TOKEN_TTL']),
			id: user.id,
		};
	}
}
