import { NextResponse } from 'next/server';

export const createResponse = (
  status: number,
  success: boolean,
  message: string | unknown
) => {
  return NextResponse.json(
    {
      success,
      message,
    },
    {
      status,
    }
  );
};
