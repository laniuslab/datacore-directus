import type { Accountability } from '@directus/types';
import { Router } from 'express';
import Joi from 'joi';
import { performance } from 'perf_hooks';
import { getAuthProvider } from '../../../auth.js';
import { AuthDriver } from '../../../auth/auth.js';
import { COOKIE_OPTIONS } from '../../../constants.js';
import env from '../../../env.js';
import { InvalidCredentialsError, InvalidPayloadError } from '../../../errors/index.js';
import { respond } from '../../../middleware/respond.js';
import type { User } from '../../../types/index.js';
import asyncHandler from '../../../utils/async-handler.js';
import { getIPFromReq } from '../../../utils/get-ip-from-req.js';
import { stall } from '../../../utils/stall.js';
import { MVAuthenticationService, VerificationsService } from '../../services/index.js';

export class OtpAuthDriver extends AuthDriver {
	async getUserID(payload: Record<string, any>): Promise<string> {
		if (!payload['email']) {
			throw new InvalidCredentialsError();
		}

		const user = await this.knex
			.select('id')
			.from('directus_users')
			.whereRaw('LOWER(??) = ?', ['email', payload['email'].toLowerCase()])
			.first();

		if (!user) {
			throw new InvalidCredentialsError();
		}

		return user.id;
	}

	async verify(user: User, otp: string): Promise<void> {
		await this.validateVerification(user.id, otp as string);
	}

	override async login(user: User, payload: Record<string, any>): Promise<void> {
		await this.verify(user, payload['otp']);
	}

	async request(user: User, ip: string, type = 'email'): Promise<void> {
		if (type == 'email') {
			const verificationSvc = new VerificationsService({
				knex: this.knex,
				schema: this.schema,
			});

			await verificationSvc.request(ip, user.id, 'email', 'Request Login', user.email as string);
		}
	}

	async validateVerification(user: string, otp: string) {
		const verificationSvc = new VerificationsService({
			knex: this.knex,
			schema: this.schema,
		});

		await verificationSvc.verify(user, 'email', 'Request Login', otp);
	}
}

export function createOtpAuthRouter(provider: string): Router {
	const router = Router();

	const userLoginSchema = Joi.object({
		email: Joi.string().email().required(),
		mode: Joi.string().valid('cookie', 'json'),
		otp: Joi.string().required(),
	}).unknown();

	const otpRequestSchema = Joi.object({
		email: Joi.string().email().required(),
	}).unknown();

	router.post(
		'/',
		asyncHandler(async (req, res, next) => {
			const STALL_TIME = env['LOGIN_STALL_TIME'];
			const timeStart = performance.now();

			const accountability: Accountability = {
				ip: getIPFromReq(req),
				userAgent: req.get('user-agent') as string,
				origin: req.get('origin') as string,
				role: null,
			};

			const mvAuthenticationService = new MVAuthenticationService({
				accountability: accountability,
				schema: req.schema,
			});

			const { error } = userLoginSchema.validate(req.body);

			if (error) {
				await stall(STALL_TIME, timeStart);
				throw new InvalidPayloadError({ reason: error.message });
			}

			const mode = req.body.mode || 'json';

			req.body.ip = accountability.ip;

			const { accessToken, refreshToken, expires } = await mvAuthenticationService.login(provider, req.body);

			const payload = {
				data: { access_token: accessToken, expires },
			} as Record<string, Record<string, any>>;

			if (mode === 'json') {
				payload['data']!['refresh_token'] = refreshToken;
			}

			if (mode === 'cookie') {
				res.cookie(env['REFRESH_TOKEN_COOKIE_NAME'], refreshToken, COOKIE_OPTIONS);
			}

			res.locals['payload'] = payload;

			return next();
		}),
		respond
	);

	router.post(
		'/request',
		asyncHandler(async (req, _res, next) => {
			const STALL_TIME = env['LOGIN_STALL_TIME'];
			const timeStart = performance.now();

			const accountability: Accountability = {
				ip: getIPFromReq(req),
				userAgent: req.get('user-agent') as string,
				origin: req.get('origin') as string,
				role: null,
			};

			const mvAuthenticationService = new MVAuthenticationService({
				accountability: accountability,
				schema: req.schema,
			});

			const { error } = otpRequestSchema.validate(req.body);

			if (error) {
				await stall(STALL_TIME, timeStart);
				throw new InvalidPayloadError({ reason: error.message });
			}

			const user = await mvAuthenticationService.loginRequest(provider, req.body);

			const authProvider = getAuthProvider(provider) as OtpAuthDriver;
			await authProvider.request(user, accountability.ip as string, 'email');

			return next();
		}),
		respond
	);

	return router;
}
