import ms from 'ms';
import { v4 as uuidv4 } from 'uuid';
import env from '../../env.js';
import { InvalidOtpError, UnexpectedResponseError } from '../../errors/index.js';
import { MailService } from '../../services/index.js';
import { ItemsService } from '../../services/items.js';
import type { AbstractServiceOptions, MutationOptions, PrimaryKey } from '../../types/index.js';
import type { Verification } from '../types/index.js';
import { generateRandomString } from '../utils/generate-random-string.js';

export class VerificationsService extends ItemsService {
	mailService: MailService;

	constructor(options: AbstractServiceOptions) {
		super('directus_verifications', options);
		this.accountability = options.accountability || null;
		this.mailService = new MailService({ schema: this.schema, accountability: this.accountability });
	}

	override async createOne(data: Partial<Verification>, opts?: MutationOptions): Promise<PrimaryKey> {
		switch (data.type) {
			case 'email':
				await this.sendEmail(data);
				break;

			// case 'sms':
			// 	await this.sendSms(data);
			// 	break;
		}

		data.id = uuidv4();
		data.ip = data.ip ? data.ip : 'system';
		return super.createOne(data, opts);
	}

	override async updateOne(key: PrimaryKey, data: Partial<Verification>, opts?: MutationOptions): Promise<PrimaryKey> {
		await this.updateMany([key], data, opts);
		return key;
	}

	async request(ip: string, user: string, carrier: string, type: string, recipient: string) {
		const generatedCode = await generateRandomString(4);
		// switch (carrier) {
		// 	case 'sms':
		// 	// 	if (toArray(env.BYPASS_PHONE).includes(recipient)) {
		// 	// 		generatedCode = env.BYPASS_CODE;
		// 	// 	} else {
		// 	// 		generatedCode = await generateRandomString(env.VERIFICATION_CODE_LENGTH);
		// 	// 	}
		// 	// 	break;
		// 	case 'email':
		//     generatedCode = await generateRandomString(4);
		// 		// TODO : create email verif schama
		// 		break;
		// }

		const requestPayload = {
			user: user,
			recipient: recipient,
			ip: ip,
			type: carrier,
			token: generatedCode,
			subject: type,
			expires: new Date(Date.now() + ms(env['AUTH_OTP_TTL'] as string)),
		};

		await this.revokeAllCurrentRequest(requestPayload);
		await this.createOne(requestPayload);
	}

	async verify(user: string, carrier: string, type: string, otp: string) {
		const verificationData = await this.readByQuery({
			filter: {
				_and: [
					{ user: { _eq: user } },
					{ type: { _eq: carrier } },
					{ subject: { _eq: type } },
					{ used_at: { _null: true } },
				],
			},
			limit: 1,
		});

		if (!verificationData[0]) {
			// throw new UnexpectedResponseError('Failed to find bind user otp');
			throw new UnexpectedResponseError();
		}

		if (verificationData[0]['token'] != otp) {
			// throw new InvalidOtpError(`otp" is invalid`);
			throw new InvalidOtpError();
		}

		if (new Date(verificationData[0]['expires']) < new Date(Date.now())) {
			// throw new InvalidOTPException(`"otp" is expired`);
			throw new InvalidOtpError();
		}

		await this.updateOne(verificationData[0]['id'], { used_at: this.knex.fn.now() });
	}

	async revokeAllCurrentRequest(data: Partial<Verification>): Promise<PrimaryKey[]> {
		return super.updateByQuery(
			{
				filter: {
					_and: [{ ip: { _eq: data.ip ? data.ip : 'system' } }, { user: { _eq: data.user as string } }],
				},
			},
			{
				used_at: this.knex.fn.now(),
			}
		);
	}

	async sendEmail(data: Partial<Verification>) {
		if (data.recipient) {
			await this.mailService.send({
				template: {
					name: 'email-verification',
					data: {
						token: data.token,
					},
				},
				to: data.recipient,
				subject: data.subject,
			});
		}
	}

	// async sendSms(data: Partial<Verification>) {
	// }
}
