import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';
import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import { Resend } from 'resend';
import handle from './yourApiHandlerFile'; // replace with the actual file path

jest.mock('stripe');
jest.mock('@prisma/client');
jest.mock('uuid');
jest.mock('resend');

const MockedStripe = Stripe as jest.MockedClass<typeof Stripe>;
const MockedPrismaClient = PrismaClient as jest.MockedClass<typeof PrismaClient>;
const MockedResend = Resend as jest.MockedClass<typeof Resend>;

describe('api handler', () => {
  it('handles successful payment', async () => {
    const mockedRequest = ({
      method: 'POST',
      body: {
        purchaserName: 'John Doe',
        purchaserEmail: 'john.doe@example.com',
        recipientName: 'Jane Doe',
        recipientEmail: 'jane.doe@example.com',
        message: 'Test message',
        giftCardValue: 100,
        stripeToken: 'token',
        currency: 'usd',
      },
    } as unknown) as NextApiRequest;

    const mockedResponse = ({
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown) as NextApiResponse;

    const mockedStripeInstance = {
      charges: { create: jest.fn().mockResolvedValue({ id: 'chargeId' }) },
    };
    MockedStripe.mockImplementation(() => mockedStripeInstance as any);

    const mockedPrismaInstance = {
      giftCard: { create: jest.fn().mockResolvedValue({}) },
    };
    MockedPrismaClient.mockImplementation(() => mockedPrismaInstance as any);

    const mockedResendInstance = {
      sendEmail: jest.fn().mockResolvedValue({}),
    };
    MockedResend.mockImplementation(() => mockedResendInstance as any);

    const uuid = 'uuid';
    (uuidv4 as jest.MockedFunction<typeof uuidv4>).mockReturnValue(uuid);

    await handle(mockedRequest, mockedResponse);

    expect(mockedResponse.status).toHaveBeenCalledWith(200);
    expect(mockedResponse.json).toHaveBeenCalledWith({ status: 'Your payment was successful' });
  });
});
