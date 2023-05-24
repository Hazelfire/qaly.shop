import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';
import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import { Resend } from 'resend';
import handle from '@/api/charge'; // replace with the actual file path

jest.mock("stripe", () => {
  return jest.fn().mockImplementation(() => {
    return {
      charges: {
        create: jest.fn().mockResolvedValue({ id: "chargeId" }),
      },
    };
  });
});

jest.mock('@prisma/client', () => {
  return {
    PrismaClient: jest.fn().mockImplementation(() => {
      return {
        giftCard: { create: jest.fn().mockResolvedValue({}) },
      };
    })
  };
});

jest.mock('uuid');
jest.mock("resend", () => {
  return {
    Resend: jest.fn().mockImplementation(() => {
      return {
        sendEmail: jest.fn().mockResolvedValue({}),
      };
    })
  };
});

describe('api handler', () => {
  beforeAll(() => {

    const uuid = 'uuid';
    (uuidv4 as jest.MockedFunction<typeof uuidv4>).mockReturnValue(uuid);
  })
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

    await handle(mockedRequest, mockedResponse);

    expect(mockedResponse.json).toHaveBeenCalledWith({ status: 'Your payment was successful' });
    expect(mockedResponse.status).toHaveBeenCalledWith(200);
  });
});
