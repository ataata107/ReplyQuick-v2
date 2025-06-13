import { getSmsConversationHistory } from '@/lib/twilio';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const numberA = searchParams.get('numberA');
  const numberB = searchParams.get('numberB');

  if (!numberA || !numberB) {
    return new Response(JSON.stringify({ success: false, error: 'Missing numbers' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const result = await getSmsConversationHistory(numberA, numberB);
  return new Response(JSON.stringify(result), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
}